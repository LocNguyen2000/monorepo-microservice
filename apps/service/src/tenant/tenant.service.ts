import { Injectable } from '@nestjs/common';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { UpdateTenantDto } from './dto/update-tenant.dto';
import { TenantModel, TenantSchema } from '@nhl/schemas/user';
import { InjectModel } from '@nestjs/sequelize';
import { PaginatedQuery, paginatedQuery } from '~/common/pagination';

@Injectable()
export class TenantService {
  constructor(
    @InjectModel(TenantSchema)
    private readonly tenantRepository: TenantModel,
  ) {}

  create(payload: Record<string, unknown>) {
    console.log('payload >', payload);

    return this.tenantRepository.create(payload);
  }

  findAll(query: PaginatedQuery) {
    return paginatedQuery<TenantSchema>(this.tenantRepository, query);
  }

  findOne(id: number) {
    return this.tenantRepository.findByPk(id);
  }

  async update(id: number, payload: Record<string, unknown>) {
    const instance = await this.tenantRepository.findByPk(id);

    console.log(instance);

    if (!instance) throw new Error('Owner not found');

    return instance.update({ ...payload });
  }

  async remove(id: number) {
    const tenant = await this.tenantRepository.findByPk(id);

    return tenant.destroy();
  }
}
