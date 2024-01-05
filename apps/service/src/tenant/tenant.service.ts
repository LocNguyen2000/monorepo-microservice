import { Inject, Injectable } from '@nestjs/common';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { UpdateTenantDto } from './dto/update-tenant.dto';
import { TENANTS_SCHEMA, TenantSchema } from '@nhl/schemas/user';
import { Repository } from 'sequelize-typescript';

@Injectable()
export class TenantService {
  constructor(
    @Inject(TENANTS_SCHEMA)
    private readonly tenantRepository: Repository<TenantSchema>,
  ) {}

  create(payload: Record<string, unknown>) {
    return this.tenantRepository.create(payload);
  }

  findAll() {
    return this.tenantRepository.findAll();
  }

  findOne(id: number) {
    return this.tenantRepository.findByPk(id);
  }

  async update(id: number, payload: Record<string, unknown>) {
    const tenant = await this.tenantRepository.findByPk(id);

    return tenant.update({ ...payload });
  }

  async remove(id: number) {
    const tenant = await this.tenantRepository.findByPk(id);

    return tenant.destroy();
  }
}
