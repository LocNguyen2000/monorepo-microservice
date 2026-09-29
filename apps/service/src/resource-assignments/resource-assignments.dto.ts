import { IsInt, Min } from 'class-validator';

export enum AssignableResourceType {
  Tenant = 'tenant',
  Location = 'location',
  Invoice = 'invoice',
  RentProvider = 'rent-provider',
}

export class AssignResourceAccountDto {
  @IsInt()
  @Min(1)
  accountId: number;
}