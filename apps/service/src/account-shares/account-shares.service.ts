import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { AccountModel, AccountSchema } from '../common/schema/auth/account.js';
import {
  AccountShareModel,
  AccountShareSchema,
} from '../common/schema/auth/account-share.js';
import { RedisManagerService } from '../common/redis/redis-manager.service.js';

@Injectable()
export class AccountSharesService {
  constructor(
    @InjectModel(AccountShareSchema)
    private readonly accountShareModel: AccountShareModel,
    @InjectModel(AccountSchema)
    private readonly accountModel: AccountModel,
    private readonly redisManager: RedisManagerService,
  ) {}

  async getReadableAccountIds(accountId: number) {
    const shares = await this.accountShareModel.findAll({
      attributes: ['ownerAccountId'],
      where: { sharedAccountId: accountId },
    });
    return [...new Set([accountId, ...shares.map(({ ownerAccountId }) => Number(ownerAccountId))])];
  }

  async listSharedAccounts(ownerAccountId: number) {
    const shares = await this.accountShareModel.findAll({
      attributes: ['sharedAccountId'],
      where: { ownerAccountId },
      order: [['sharedAccountId', 'ASC']],
    });
    return shares.map(({ sharedAccountId }) => Number(sharedAccountId));
  }

  async shareAccount(ownerAccountId: number, sharedAccountId: number) {
    if (ownerAccountId === sharedAccountId) {
      throw new ConflictException('An account cannot share data with itself');
    }

    const account = await this.accountModel.findByPk(sharedAccountId);
    if (!account) throw new NotFoundException('Shared account not found');

    const [, created] = await this.accountShareModel.findOrCreate({
      where: { ownerAccountId, sharedAccountId },
      defaults: { ownerAccountId, sharedAccountId },
    });
    await this.redisManager.invalidateLocationCaches([sharedAccountId]);
    return { ownerAccountId, sharedAccountId, alreadyShared: !created };
  }

  async revokeShare(ownerAccountId: number, sharedAccountId: number) {
    const revoked = (await this.accountShareModel.destroy({
      where: { ownerAccountId, sharedAccountId },
    })) > 0;
    if (revoked) {
      await this.redisManager.invalidateLocationCaches([sharedAccountId]);
    }
    return { ownerAccountId, sharedAccountId, revoked };
  }
}