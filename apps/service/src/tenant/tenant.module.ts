import { Module } from '@nestjs/common';
import { TenantService } from './tenant.service';
import { TenantController } from './tenant.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { TenantLocationSchema, TenantSchema } from '../common/schema/user';
import { FilePostModule } from '../filepost/filepost.module';

@Module({
  imports: [SequelizeModule.forFeature([TenantSchema, TenantLocationSchema]), FilePostModule],
  controllers: [TenantController],
  providers: [TenantService],
  exports: [TenantService],
})
export class TenantModule { }
