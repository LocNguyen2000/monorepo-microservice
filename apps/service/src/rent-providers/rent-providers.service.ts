import { Inject, Injectable } from '@nestjs/common';
import { RENT_PROVIDER_SCHEMA, RentProviderSchema } from '@nhl/schemas/user';
import { Repository } from 'sequelize-typescript';
import { UpdateLocationDto } from '~/locations/dto/update-location.dto';

@Injectable()
export class RentProvidersService {
  constructor(
    @Inject(RENT_PROVIDER_SCHEMA)
    private readonly rentProviderRepository: Repository<RentProviderSchema>,
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
    const provider = await this.rentProviderRepository.findByPk(id);

    return provider.update({ ...payload });
  }

  remove(id: number) {
    return `This action removes a #${id} location`;
  }
}
