import { Injectable, NotFoundException } from '@nestjs/common';
import { RentProviderModel, RentProviderSchema } from '../common/schema/user/index.js';
import { UpsertRentProviderDto } from './dto/upsert-provider.dto.js';
import { InjectModel } from '@nestjs/sequelize';
import { PaginatedQuery, paginatedQuery } from '../common/pagination.js';
import { AccountSharesService } from '../account-shares/account-shares.service.js';
import { Op } from 'sequelize';

@Injectable()
export class RentProvidersService {
  constructor(
    @InjectModel(RentProviderSchema)
    private readonly rentProviderRepository: RentProviderModel,
    private readonly accountSharesService: AccountSharesService,
  ) {}

  create(payload: Record<string, unknown>, accountId: number) {
    return this.rentProviderRepository.create({ ...payload, accountId });
  }

  async findAll(query: PaginatedQuery, accountId: number) {
    const readableAccountIds = await this.accountSharesService.getReadableAccountIds(accountId);
    return paginatedQuery<RentProviderSchema>(
      this.rentProviderRepository,
      query,
      { where: { accountId: { [Op.in]: readableAccountIds } } },
    );
  }

  async findOne(id: number, accountId: number) {
    const readableAccountIds = await this.accountSharesService.getReadableAccountIds(accountId);
    return this.rentProviderRepository.findOne({
      where: { providerCode: id, accountId: { [Op.in]: readableAccountIds } },
    });
  }

  findOwnedOne(id: number, accountId: number) {
    return this.rentProviderRepository.findOne({
      where: { providerCode: id, accountId },
    });
  }

  async update(id: number, payload: Record<string, unknown>, accountId: number) {
    const instance = await this.rentProviderRepository.findOne({
      where: { providerCode: id, accountId },
    });

    if (!instance) throw new NotFoundException('Owner not found');

    return instance.update({ ...payload, accountId });
  }

  async remove(id: number, accountId: number) {
    const provider = await this.rentProviderRepository.findOne({
      where: { providerCode: id, accountId },
    });

    if (!provider) throw new NotFoundException('Owner not found');
    return provider.destroy();
  }
}
