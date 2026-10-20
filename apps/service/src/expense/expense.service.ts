import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import {
  ExpenseLocationModel,
  ExpenseLocationSchema,
  ExpenseModel,
  ExpenseSchema,
} from '../common/schema/user/index.js';
import { PaginatedQuery, paginatedQuery } from '../common/pagination.js';
import { AccountSharesService } from '../account-shares/account-shares.service.js';
import { Op } from 'sequelize';
import { RedisManagerService } from '../common/redis/redis-manager.service.js';

@Injectable()
export class ExpenseService {
  constructor(
    @InjectModel(ExpenseSchema)
    private readonly expenseRepository: ExpenseModel,
    private readonly accountSharesService: AccountSharesService,
    private readonly redisManager: RedisManagerService,
  ) {}

  async create(payload: Record<string, unknown>, accountId: number) {
    const sharedAccountIds =
      await this.accountSharesService.listSharedAccounts(accountId);
    const result = await this.expenseRepository.create({
      ...payload,
      unitName: payload.unitName || 'unit',
      accountId,
    });
    await this.redisManager.invalidateLocationCaches([
      accountId,
      ...sharedAccountIds,
    ]);
    return result;
  }

  async findAll(query: PaginatedQuery, accountId: number) {
    const readableAccountIds = await this.accountSharesService.getReadableAccountIds(accountId);
    return paginatedQuery<ExpenseSchema>(this.expenseRepository, query, {
      where: { accountId: { [Op.in]: readableAccountIds } },
    });
  }

  async findOne(id: number, accountId: number) {
    const readableAccountIds = await this.accountSharesService.getReadableAccountIds(accountId);
    const response = await this.expenseRepository.findOne({
      where: { expenseCode: id, accountId: { [Op.in]: readableAccountIds } },
    });
    return response
  }

  async update(id: number, payload: Record<string, unknown>, accountId: number) {
    const instance = await this.expenseRepository.findOne({
      where: { expenseCode: id, accountId },
    });

    if (!instance) throw new NotFoundException('Expense not found');

    const sharedAccountIds =
      await this.accountSharesService.listSharedAccounts(accountId);
    const result = await instance.update({ ...payload, accountId });
    await this.redisManager.invalidateLocationCaches([
      accountId,
      ...sharedAccountIds,
    ]);
    return result;
  }

  async remove(id: number, accountId: number) {
    const expense = await this.expenseRepository.findOne({
      where: { expenseCode: id, accountId },
    });
    if (!expense) throw new NotFoundException('Expense not found');

    const sharedAccountIds =
      await this.accountSharesService.listSharedAccounts(accountId);
    const result = await expense.destroy();
    await this.redisManager.invalidateLocationCaches([
      accountId,
      ...sharedAccountIds,
    ]);
    return result;
  }
}
