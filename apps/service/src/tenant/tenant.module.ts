import { Module } from '@nestjs/common';
import { TenantService } from './tenant.service';
import { TenantController } from './tenant.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { TenantSchema } from '../common/schema/user';

@Module({
  imports: [SequelizeModule.forFeature([TenantSchema])],
  controllers: [TenantController],
  providers: [TenantService],
  exports: [TenantService],
})
export class TenantModule {}
