import { Module } from '@nestjs/common';
import { RentProvidersController } from './rent-providers.controller';
import { RentProvidersService } from './rent-providers.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { RentProviderSchema } from '@nhl/schemas/user';

@Module({
  imports: [SequelizeModule.forFeature([RentProviderSchema])],
  controllers: [RentProvidersController],
  providers: [RentProvidersService],
})
export class RentProvidersModule {}
