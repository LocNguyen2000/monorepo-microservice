import { RENT_PROVIDER_SCHEMA, RentProviderSchema } from '@nhl/schemas/user';

export const providerRentProviders = [
  {
    provide: RENT_PROVIDER_SCHEMA,
    useValue: RentProviderSchema,
  },
];
