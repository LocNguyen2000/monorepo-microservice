import { Module } from '@nestjs/common';
import { RentProvidersController } from './rent-providers.controller.js';
import { RentProvidersService } from './rent-providers.service.js';
import { SequelizeModule } from '@nestjs/sequelize';
import { RentProviderSchema } from '../common/schema/user/index.js';
import { AccountSharesModule } from '../account-shares/account-shares.module.js';

@Module({
  imports: [SequelizeModule.forFeature([RentProviderSchema]), AccountSharesModule],
  controllers: [RentProvidersController],
  providers: [RentProvidersService],
  exports: [RentProvidersService],
})
export class RentProvidersModule {}
