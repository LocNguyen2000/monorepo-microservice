import { Module } from '@nestjs/common';
import { RentProvidersController } from './rent-providers.controller';
import { providerRentProviders } from './rent-providers.provider';

@Module({
  controllers: [RentProvidersController],
  providers: [...providerRentProviders],
})
export class RentProvidersModule {}
