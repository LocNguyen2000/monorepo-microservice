import { Injectable } from '@nestjs/common';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { UpdateTenantDto } from './dto/update-tenant.dto';
import { TenantModel, TenantSchema } from '../common/schema/user';
import { InjectModel } from '@nestjs/sequelize';
import { PaginatedQuery, paginatedQuery } from '../common/pagination';
import { FilePostService } from '../filepost/filepost.service';

@Injectable()
export class TenantService {
  constructor(
    @InjectModel(TenantSchema)
    private readonly tenantRepository: TenantModel,
    private readonly filePostService: FilePostService,
  ) {}

  async create(payload: Record<string, unknown>, contract?: Express.Multer.File) {
    const contractUrl = contract
      ? await this.filePostService.upload(contract)
      : undefined;

    return this.tenantRepository.create({ ...payload, contractUrl });
  }

  findAll(query: PaginatedQuery) {
    return paginatedQuery<TenantSchema>(this.tenantRepository, query);
  }

  findOne(id: number) {
    return this.tenantRepository.findByPk(id);
  }

  findTenantsByLocation(id: number) {
    return this.tenantRepository.findAll({
      where: {
        locationCode: id,
      },
    });
  }

  async update(
    id: number,
    payload: Record<string, unknown>,
    contract?: Express.Multer.File,
  ) {
    const instance = await this.tenantRepository.findByPk(id);

    if (!instance) throw new Error('Owner not found');

    const contractUrl = contract
      ? await this.filePostService.upload(contract)
      : undefined;

    return instance.update({
      ...payload,
      ...(contractUrl ? { contractUrl } : {}),
    });
  }

  async remove(id: number) {
    const tenant = await this.tenantRepository.findByPk(id);

    return tenant.destroy();
  }
}
