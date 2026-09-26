import { Injectable, NotFoundException } from '@nestjs/common';
import {
  LocationModel,
  LocationSchema,
  TenantModel,
  TenantSchema,
} from '../common/schema/user/index.js';
import { InjectModel } from '@nestjs/sequelize';
import { PaginatedQuery, paginatedQuery } from '../common/pagination.js';
import { FilePostService } from '../filepost/filepost.service.js';
import { TenantLocationModel, TenantLocationSchema } from '../common/schema/user/index.js';
import { Op } from 'sequelize';
import 'multer';

@Injectable()
export class TenantService {
  constructor(
    @InjectModel(TenantSchema)
    private readonly tenantRepository: TenantModel,
    @InjectModel(TenantLocationSchema)
    private readonly tenantLocationRepository: TenantLocationModel,
    @InjectModel(LocationSchema)
    private readonly locationRepository: LocationModel,
    private readonly filePostService: FilePostService,
  ) { }

  async create(
    payload: Record<string, unknown>,
    accountId: number,
    contract?: Express.Multer.File,
  ) {
    const { locationCode, ...tenantPayload } = payload;
    if (locationCode) {
      await this.findLocationForAccount(Number(locationCode), accountId);
    }
    const contractUrl = contract
      ? await this.filePostService.upload(contract)
      : undefined;

    const tenant = await this.tenantRepository.create({
      ...tenantPayload,
      contractUrl,
      accountId,
    });
    if (locationCode) {
      await this.assignLocation(tenant.tenantCode, Number(locationCode), accountId);
    }
    return tenant;
  }

  findAll(query: PaginatedQuery, accountId: number) {
    return paginatedQuery<TenantSchema>(this.tenantRepository, query, {
      where: { accountId },
    });
  }

  async findOne(id: number, accountId: number) {
    const tenant = await this.tenantRepository.findOne({
      where: { tenantCode: id, accountId },
    });
    if (!tenant) throw new NotFoundException('Tenant not found');
    return tenant;
  }

  async findTenantsByLocation(id: number, accountId: number) {
    await this.findLocationForAccount(id, accountId);
    const assignments = await this.tenantLocationRepository.findAll({
      where: { locationCode: id },
    });
    const assignedTenantCodes = assignments.map(({ tenantCode }) => tenantCode);

    return this.tenantRepository.findAll({
      where: {
        accountId,
        tenantCode: { [Op.in]: assignedTenantCodes },
      },
    });
  }

  async findLocationsByTenant(tenantCode: number, accountId: number) {
    await this.findOne(tenantCode, accountId);
    const assignments = await this.tenantLocationRepository.findAll({
      where: { tenantCode },
    });
    const assignedLocationCodes = assignments.map(({ locationCode }) => locationCode);
    const locations = await this.locationRepository.findAll({
      attributes: ['locationCode'],
      where: {
        accountId,
        locationCode: { [Op.in]: assignedLocationCodes },
      },
    });
    const ownedLocationCodes = new Set(locations.map(({ locationCode }) => Number(locationCode)));
    return assignments.filter(({ locationCode }) => ownedLocationCodes.has(Number(locationCode)));
  }

  async assignLocation(tenantCode: number, locationCode: number, accountId: number) {
    const tenant = await this.findOne(tenantCode, accountId);
    await this.findLocationForAccount(locationCode, accountId);

    await this.tenantLocationRepository.findOrCreate({
      where: { tenantCode, locationCode },
      defaults: { tenantCode, locationCode },
    });

    return tenant;
  }

  async update(
    id: number,
    payload: Record<string, unknown>,
    accountId: number,
    contract?: Express.Multer.File,
  ) {
    const { locationCode, ...tenantPayload } = payload;
    if (locationCode) {
      await this.findLocationForAccount(Number(locationCode), accountId);
    }
    const instance = await this.tenantRepository.findOne({
      where: { tenantCode: id, accountId },
    });

    if (!instance) throw new NotFoundException('Tenant not found');

    const contractUrl = contract
      ? await this.filePostService.upload(contract)
      : undefined;

    const result = await instance.update({
      ...tenantPayload,
      ...(contractUrl ? { contractUrl } : {}),
      accountId,
    });

    if (locationCode) await this.assignLocation(id, Number(locationCode), accountId);
    return result;
  }

  async remove(id: number, accountId: number) {
    const tenant = await this.tenantRepository.findOne({
      where: { tenantCode: id, accountId },
    });
    if (!tenant) throw new NotFoundException('Tenant not found');

    return tenant.destroy();
  }

  private async findLocationForAccount(locationCode: number, accountId: number) {
    const location = await this.locationRepository.findOne({
      where: { locationCode, accountId },
    });
    if (!location) throw new NotFoundException('Location not found');
    return location;
  }
}
