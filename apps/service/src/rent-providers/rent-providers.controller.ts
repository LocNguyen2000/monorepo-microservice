import { Controller, Get, Inject } from '@nestjs/common';
import { RENT_PROVIDER_SCHEMA, RentProviderSchema } from '@nhl/schemas/user';
import { Repository } from 'sequelize-typescript';

@Controller('rent-providers')
export class RentProvidersController {
  constructor(
    @Inject(RENT_PROVIDER_SCHEMA)
    private readonly rentProviderRepository: Repository<RentProviderSchema>,
  ) {}

  @Get()
  findAll() {
    return this.rentProviderRepository.findAll();
  }
}
