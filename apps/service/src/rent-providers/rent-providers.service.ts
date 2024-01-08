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

  async update(id: number, payload: UpsertRentProviderDto) {
    const instance = await this.rentProviderRepository.findByPk(id);

    const response = await instance.update({ ...payload });
    return response;
  }

  remove(id: number) {
    return `This action removes a #${id} location`;
  }
}
