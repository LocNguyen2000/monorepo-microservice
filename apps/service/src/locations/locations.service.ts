import { Injectable } from '@nestjs/common';
import {} from 'sequelize-typescript';
import {
  ExpenseLocationModel,
  ExpenseLocationSchema,
  ExpenseSchema,
  LocationModel,
  LocationSchema,
} from '../common/schema/user';
import { InjectModel } from '@nestjs/sequelize';
import { PaginatedQuery, paginatedQuery } from '../common/pagination';
import { LocationWithExpenses } from '../common/types';
import { omit, pick } from 'lodash';
import { FilePostService } from '../filepost/filepost.service';

@Injectable()
export class LocationsService {
  constructor(
    @InjectModel(LocationSchema)
    private readonly locationModel: LocationModel,
    @InjectModel(ExpenseLocationSchema)
    private readonly expenseLocationRepository: ExpenseLocationModel,
    private readonly filePostService: FilePostService,
  ) {}

  async create(
    createLocationDto: Record<string, unknown>,
    image?: Express.Multer.File,
  ) {
    const imageUrl = image ? await this.filePostService.upload(image) : undefined;

    return this.locationModel.create({
      ...createLocationDto,
      ...(imageUrl ? { image: imageUrl } : {}),
    });
  }

  findAll(query: PaginatedQuery) {
    return paginatedQuery<LocationSchema>(this.locationModel, query);
  }

  async findOne(id: number) {
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
    image?: Express.Multer.File,
  ) {
    try {
      const imageUrl = image ? await this.filePostService.upload(image) : undefined;

      payload = pick(payload, [
        'locationName',
        'locationAddress',
        'roomSize',
        'description',
        'image',
        'owner',
      ]);
      if (imageUrl) payload.image = imageUrl;
      console.log(payload);

      const instance = await this.locationModel.findByPk(id);

      console.log('instance', instance);

      if (!instance) throw new Error('Cannot find location');

      const response = await this.locationModel.update(payload, {
        where: { locationCode: id },
      });
      return response;
    } catch (error) {
      console.log('Ehh', error);
    }
  }

  async remove(id: number) {
    const location = await this.locationModel.findByPk(id);

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

    console.log(formatLocation);

    return formatLocation;
  }

  async updateExpensesByLocation(locationCode: number, payload: any[]) {
    console.log(payload);
    console.log(locationCode);

    await this.expenseLocationRepository.destroy({
      where: { locationCode: locationCode },
    });

    return this.expenseLocationRepository.bulkCreate(
      payload.map((p) => {
        return { ...p, locationCode };
      }),
    );
  }
}
