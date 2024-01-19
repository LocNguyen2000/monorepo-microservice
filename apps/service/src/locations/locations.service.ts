import { Injectable } from '@nestjs/common';
import {} from 'sequelize-typescript';
import {
  ExpenseLocationModel,
  ExpenseLocationSchema,
  ExpenseSchema,
  LocationModel,
  LocationSchema,
} from '@nhl/schemas/user';
import { InjectModel } from '@nestjs/sequelize';
import { PaginatedQuery, paginatedQuery } from '~/common/pagination';
import { LocationWithExpenses } from '~/common/types';
import { omit } from 'lodash';

@Injectable()
export class LocationsService {
  constructor(
    @InjectModel(LocationSchema)
    private readonly locationModel: LocationModel,
    @InjectModel(ExpenseLocationSchema)
    private readonly expenseLocationRepository: ExpenseLocationModel,
  ) {}

  async create(createLocationDto: Record<string, unknown>) {
    return this.locationModel.create(createLocationDto);
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

  async update(id: number, payload: Record<string, unknown>) {
    const instance = await this.locationModel.findByPk(id);

    if (!instance) throw new Error('Cannot find location');

    const response = await instance.update({ ...payload });
    return response;
  }

  async remove(id: number) {
    const location = await this.locationModel.findByPk(id);

    return location.destroy();
  }

  formatLocationExpense(data: LocationWithExpenses[]): LocationSchema {
    console.log(data);

    const expenseKeys = [
      'expenseCode',
      'expenseName',
      'type',
      'price',
      'inUsed',
    ];

    const formatLocation = omit(
      data.reduce((acc, curr) => {
        Object.assign(acc, curr);

        if (!acc?.expenses || acc?.expenses.length === 0) acc.expenses = [];

        const expense: Partial<ExpenseSchema> = {
          expenseCode: curr.expenseCode,
          expenseName: curr.expenseName,
          type: curr.type,
          price: curr.price,
          inUsed: curr.inUsed,
        };

        if (curr.expenseCode && curr.expenseName && curr.price)
          acc.expenses.push(expense);

        return acc;
      }, {} as LocationSchema),
      expenseKeys,
    ) as LocationSchema;

    return formatLocation;
  }

  async assignExpensesToLocation(locationCode: number, payload: number[]) {
    await this.expenseLocationRepository.destroy({
      where: { locationCode: locationCode },
    });

    return this.expenseLocationRepository.bulkCreate(
      payload.map((p) => {
        return { expenseCode: p, locationCode };
      }),
    );
  }
}
