import { Injectable, NotImplementedException } from '@nestjs/common';
import { PaginatedQuery } from '~/common/pagination';
import { RentProvidersService } from '~/rent-providers/rent-providers.service';
import { TenantService } from '~/tenant/tenant.service';
import { LocationsService } from '~/locations/locations.service';
import { ExpenseService } from '~/expense/expense.service';

@Injectable()
export class InvoicesService {
  constructor(
    private readonly locationSvc: LocationsService,
    private readonly rentProviderSvc: RentProvidersService,
    private readonly tenantSvc: TenantService,
  ) {}
  create(payload: Record<string, unknown>) {
    throw new NotImplementedException();
  }

  findAll(query: PaginatedQuery) {
    throw new NotImplementedException();
  }

  async findOneByTenantId(id: number) {
    const result = {};
    const tenant = await this.tenantSvc.findOne(id);
    Object.assign(result, { tenant });
    if (tenant.locationCode) {
      const location = await this.locationSvc.findOne(tenant.locationCode);
      Object.assign(result, { location });
      if (location.owner) {
        const owner = await this.rentProviderSvc.findOne(+location.owner);
        Object.assign(result, { owner });
      }
    }

    return result;
  }

  async findOneByLocation(id: number) {
    const result = {};
    const location = await this.locationSvc.findOne(id);

    const tenants =
      (await this.tenantSvc.findTenantsByLocation(+location.locationCode)) ||
      [];

    const owner = await this.rentProviderSvc.findOne(+location.owner);

    Object.assign(result, { location, tenants, owner });

    return result;
  }

  async update(id: number, payload: Record<string, unknown>) {
    throw new NotImplementedException();
  }

  async remove(id: number) {
    throw new NotImplementedException();
  }
}
