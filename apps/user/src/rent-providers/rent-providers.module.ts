import { Module } from '@nestjs/common';
import { RentProvidersController } from './rent-providers.controller';
import { ProviderRentProviders } from './rent-providers.provider';

@Module({
  controllers: [RentProvidersController],
  providers: [...ProviderRentProviders],
})
export class RentProvidersModule {}
