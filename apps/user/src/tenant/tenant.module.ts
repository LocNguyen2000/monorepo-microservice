import { Module } from '@nestjs/common';
import { TenantService } from './tenant.service';
import { TenantController } from './tenant.controller';
import { TenantProviders } from './tenant.provider';

@Module({
  controllers: [TenantController],
  providers: [TenantService, ...TenantProviders],
})
export class TenantModule {}
