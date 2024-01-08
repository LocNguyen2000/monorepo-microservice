import { Injectable } from '@nestjs/common';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { UpdateTenantDto } from './dto/update-tenant.dto';
import { TenantModel, TenantSchema } from '@nhl/schemas/user';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class TenantService {
  constructor(
    @InjectModel(TenantSchema)
    private readonly tenantRepository: TenantModel,
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
