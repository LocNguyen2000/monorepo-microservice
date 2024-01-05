import { Inject, Injectable } from '@nestjs/common';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { UpdateTenantDto } from './dto/update-tenant.dto';
import { TENANTS_SCHEMA, TenantSchema } from '@nhl/schemas/user';
import { Repository } from 'sequelize-typescript';

@Injectable()
export class TenantService {
  constructor(
    @Inject(TENANTS_SCHEMA)
    private readonly rentProviderRepository: Repository<TenantSchema>,
  ) {}

  create(createTenantDto: CreateTenantDto) {
    return 'This action adds a new tenant';
  }

  findAll() {
    return this.rentProviderRepository.findAll();
  }

  findOne(id: number) {
    return this.rentProviderRepository.findByPk(id);
  }

  update(id: number, updateTenantDto: UpdateTenantDto) {
    return `This action updates a #${id} tenant`;
  }

  remove(id: number) {
    return `This action removes a #${id} tenant`;
  }
}
