import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { } from 'sequelize-typescript';
import {
  ExpenseLocationModel,
  ExpenseLocationSchema,
  ExpenseSchema,
  LocationModel,
  LocationSchema,
} from '../common/schema/user/index.js';
import { InjectModel } from '@nestjs/sequelize';
import { PaginatedQuery, paginatedQuery } from '../common/pagination.js';
import { LocationWithExpenses } from '../common/types.js';
import lodash from 'lodash';
const { omit, pick } = lodash;
import { FilePostService } from '../filepost/filepost.service.js';
import { RentProvidersService } from '../rent-providers/rent-providers.service.js';

@Injectable()
export class LocationsService {
  constructor(
    @InjectModel(LocationSchema)
    private readonly locationModel: LocationModel,
    @InjectModel(ExpenseLocationSchema)
    private readonly expenseLocationRepository: ExpenseLocationModel,
    private readonly filePostService: FilePostService,
    private readonly rentProviderService: RentProvidersService,
  ) { }

  async create(
    createLocationDto: Record<string, unknown>,
    accountId: number,
    image?: Express.Multer.File,
  ) {
    await this.assertOwnerBelongsToAccount(createLocationDto.owner, accountId);
    const imageUrl = image ? await this.filePostService.upload(image) : undefined;

    return this.locationModel.create({
      ...createLocationDto,
      ...(imageUrl ? { image: imageUrl } : {}),
      accountId,
    });
  }

  findAll(query: PaginatedQuery, accountId: number) {
    return paginatedQuery<LocationSchema>(this.locationModel, query, {
      where: { accountId },
      include: [
        {
          model: ExpenseSchema,
          through: { attributes: [] },
        },
      ],
      distinct: true,
    });
  }

  findAllForSystem(query: PaginatedQuery) {
    return paginatedQuery<LocationSchema>(this.locationModel, query, {
      include: [
        {
          model: ExpenseSchema,
          through: { attributes: [] },
        },
      ],
      distinct: true,
    });
  }

  async findOne(id: number, accountId: number) {
    await this.findLocationRecord(id, accountId);
    const sql = 'CALL prcd_FindLocationExpenseById (:id)';

    const locations = (await this.locationModel.sequelize.query(sql, {
      replacements: { id },
    })) as unknown as LocationWithExpenses[];

    if (locations && locations.length === 0)
      throw new Error('Cannot find location');

    const result = this.formatLocationExpense(locations);

    return result;
  }

  async update(
    id: number,
    payload: Record<string, unknown>,
    accountId: number,
    image?: Express.Multer.File,
  ) {
    await this.findLocationRecord(id, accountId);
    payload = pick(payload, [
      'locationName',
      'locationAddress',
      'roomSize',
      'description',
      'image',
      'owner',
    ]);
    await this.assertOwnerBelongsToAccount(payload.owner, accountId);
    const imageUrl = image ? await this.filePostService.upload(image) : undefined;
    if (imageUrl) payload.image = imageUrl;

    return this.locationModel.update(payload, {
      where: { locationCode: id, accountId },
    });
  }

  async remove(id: number, accountId: number) {
    const location = await this.findLocationRecord(id, accountId);

    return location.destroy();
  }

  formatLocationExpense(data: LocationWithExpenses[]): LocationSchema {
    const expenseKeys = [
      'expenseCode',
      'expenseName',
      'initialUnit',
      'currentUnit',
      'unitName',
      'type',
      'price',
      'inUsed',
    ];

    const formatLocation = omit(
      data.reduce((acc, curr) => {
        console.log(curr);

        Object.assign(acc, curr);

        if (!acc?.expenses || acc?.expenses.length === 0) acc.expenses = [];

        const expense = {
          expenseCode: curr.expenseCode,
          expenseName: curr.expenseName,
          type: curr.type,
          price: curr.price,
          inUsed: curr.inUsed,
          initialUnit: curr.initialUnit,
          currentUnit: curr.currentUnit,
          unitName: curr.unitName,
        };

        if (curr.expenseCode && curr.expenseName && curr.price)
          acc.expenses.push(expense);

        return acc;
      }, {} as LocationSchema),
      expenseKeys,
    ) as LocationSchema;

    formatLocation.expenses?.sort(
      (expenseA, expenseB) => Number(expenseB.price) - Number(expenseA.price),
    );

    console.log(formatLocation);

    return formatLocation;
  }

  async updateExpensesByLocation(
    locationCode: number,
    payload: any[],
    accountId: number,
  ) {
    await this.findLocationRecord(locationCode, accountId);

    await this.expenseLocationRepository.destroy({
      where: { locationCode: locationCode },
    });

    return this.expenseLocationRepository.bulkCreate(
      payload.map((p) => {
        return { ...p, locationCode };
      }),
    );
  }

  async updateMeterReading(
    locationCode: number,
    expenseCode: number,
    currentUnit: number,
    accountId: number,
  ) {
    if (!Number.isInteger(locationCode) || !Number.isInteger(expenseCode)) {
      throw new BadRequestException('Location and expense are required');
    }

    if (!Number.isFinite(currentUnit) || currentUnit < 0) {
      throw new BadRequestException('Meter reading must be a non-negative number');
    }

    await this.findLocationRecord(locationCode, accountId);

    const expenseLocation = await this.expenseLocationRepository.findOne({
      where: { locationCode, expenseCode },
    });

    if (!expenseLocation) {
      throw new NotFoundException('Expense is not assigned to this location');
    }

    if (currentUnit < expenseLocation.currentUnit) {
      throw new BadRequestException('Meter reading cannot be lower than the previous reading');
    }

    const initialUnit = expenseLocation.currentUnit;
    await expenseLocation.update({ initialUnit, currentUnit });

    return { locationCode, expenseCode, initialUnit, currentUnit };
  }

  private async findLocationRecord(id: number, accountId: number) {
    const location = await this.locationModel.findOne({
      where: { locationCode: id, accountId },
    });
    if (!location) throw new NotFoundException('Location not found');
    return location;
  }

  private async assertOwnerBelongsToAccount(owner: unknown, accountId: number) {
    if (owner === undefined || owner === null || owner === '') return;
    const provider = await this.rentProviderService.findOne(Number(owner), accountId);
    if (!provider) throw new NotFoundException('Owner not found');
  }
}
