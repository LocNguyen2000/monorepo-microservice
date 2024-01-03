import { TENANTS_SCHEMA, TenantSchema } from '@nhl/schemas/user';

export const TenantProviders = [
  {
    provide: TENANTS_SCHEMA,
    useValue: TenantSchema,
  },
];
