import { Module } from '@nestjs/common';
import { TenantService } from './tenant.service';
import { TenantController } from './tenant.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { TenantSchema } from '@nhl/schemas/user';

@Module({
  imports: [SequelizeModule.forFeature([TenantSchema])],
  controllers: [TenantController],
  providers: [TenantService],
})
export class TenantModule {}
