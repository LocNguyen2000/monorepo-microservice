import { Injectable } from '@nestjs/common';
import { RentProviderModel, RentProviderSchema } from '@nhl/schemas/user';
import { UpsertRentProviderDto } from './dto/upsert-provider.dto';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class RentProvidersService {
  constructor(
    @InjectModel(RentProviderSchema)
    private readonly rentProviderRepository: RentProviderModel,
  ) {}

  create(payload: Record<string, unknown>) {
    return this.rentProviderRepository.create(payload);
  }

  findAll() {
    return this.rentProviderRepository.findAll();
  }

  findOne(id: number) {
    return this.rentProviderRepository.findByPk(id);
  }

  async update(id: number, payload: Record<string, unknown>) {
    const instance = await this.rentProviderRepository.findByPk(id);

    if (!instance) throw new Error('Owner not found');

    return instance.update({ ...payload });
  }

  remove(id: number) {
    return `This action removes a #${id} location`;
  }
}
