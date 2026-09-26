import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import {
  ExpenseLocationModel,
  ExpenseLocationSchema,
  ExpenseModel,
  ExpenseSchema,
} from '../common/schema/user/index.js';
import { PaginatedQuery, paginatedQuery } from '../common/pagination.js';

@Injectable()
export class ExpenseService {
  constructor(
    @InjectModel(ExpenseSchema)
    private readonly expenseRepository: ExpenseModel,
  ) {}

  create(payload: Record<string, unknown>, accountId: number) {
    return this.expenseRepository.create({
      ...payload,
      unitName: payload.unitName || 'unit',
      accountId,
    });
  }

  findAll(query: PaginatedQuery, accountId: number) {
    return paginatedQuery<ExpenseSchema>(this.expenseRepository, query, {
      where: { accountId },
    });
  }

  findOne(id: number, accountId: number) {
    return this.expenseRepository.findOne({
      where: { expenseCode: id, accountId },
    });
  }

  async update(id: number, payload: Record<string, unknown>, accountId: number) {
    const instance = await this.expenseRepository.findOne({
      where: { expenseCode: id, accountId },
    });

    if (!instance) throw new NotFoundException('Expense not found');

    return instance.update({ ...payload, accountId });
  }

  async remove(id: number, accountId: number) {
    const expense = await this.expenseRepository.findOne({
      where: { expenseCode: id, accountId },
    });
    if (!expense) throw new NotFoundException('Expense not found');

    return expense.destroy();
  }
}
