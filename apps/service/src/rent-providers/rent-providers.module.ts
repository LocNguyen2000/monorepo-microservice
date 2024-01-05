import { Module } from '@nestjs/common';
import { RentProvidersController } from './rent-providers.controller';
import { ProviderRentProviders } from './rent-providers.provider';
import { RentProvidersService } from './rent-providers.service';

@Module({
  controllers: [RentProvidersController],
  providers: [...ProviderRentProviders, RentProvidersService],
})
export class RentProvidersModule {}
