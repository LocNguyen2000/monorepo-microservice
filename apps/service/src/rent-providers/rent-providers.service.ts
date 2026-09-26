import { Injectable, NotFoundException } from '@nestjs/common';
import { RentProviderModel, RentProviderSchema } from '../common/schema/user/index.js';
import { UpsertRentProviderDto } from './dto/upsert-provider.dto.js';
import { InjectModel } from '@nestjs/sequelize';
import { PaginatedQuery, paginatedQuery } from '../common/pagination.js';

@Injectable()
export class RentProvidersService {
  constructor(
    @InjectModel(RentProviderSchema)
    private readonly rentProviderRepository: RentProviderModel,
  ) {}

  create(payload: Record<string, unknown>, accountId: number) {
    return this.rentProviderRepository.create({ ...payload, accountId });
  }

  findAll(query: PaginatedQuery, accountId: number) {
    return paginatedQuery<RentProviderSchema>(
      this.rentProviderRepository,
      query,
      { where: { accountId } },
    );
  }

  findOne(id: number, accountId: number) {
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
