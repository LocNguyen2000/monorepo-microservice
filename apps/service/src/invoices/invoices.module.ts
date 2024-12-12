import { Module } from '@nestjs/common';
import { InvoicesController } from './invoices.controller';
import { InvoicesService } from './invoices.service';
import { LocationsModule } from '~/locations/locations.module';
import { TenantModule } from '~/tenant/tenant.module';
import { RentProvidersModule } from '~/rent-providers/rent-providers.module';

@Module({
  imports: [TenantModule, LocationsModule, RentProvidersModule],
  controllers: [InvoicesController],
  providers: [InvoicesService],
})
export class InvoicesModule {}
