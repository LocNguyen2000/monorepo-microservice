import { LOCATION_SCHEMA, LocationSchema } from '@nhl/schemas/user';

export const LocationProvider = [
  {
    provide: LOCATION_SCHEMA,
    useValue: LocationSchema,
  },
];
