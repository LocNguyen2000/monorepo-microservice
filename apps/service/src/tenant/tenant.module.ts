import { Module } from '@nestjs/common';
import { TenantService } from './tenant.service.js';
import { TenantController } from './tenant.controller.js';
import { SequelizeModule } from '@nestjs/sequelize';
import { LocationSchema, TenantLocationSchema, TenantSchema } from '../common/schema/user/index.js';
import { FilePostModule } from '../filepost/filepost.module.js';

@Module({
  imports: [SequelizeModule.forFeature([TenantSchema, TenantLocationSchema, LocationSchema]), FilePostModule],
  controllers: [TenantController],
  providers: [TenantService],
  exports: [TenantService],
})
export class TenantModule { }
