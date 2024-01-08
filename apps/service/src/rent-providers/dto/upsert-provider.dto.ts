import { RentProviderSchema } from '@nhl/schemas/user';

export class UpsertRentProviderDto {
  providerCode: number;

  providerName: string;

  firstName?: string;

  lastName?: string;

  dateOfBirth: Date;

  phoneNumber: string;

  email?: string;

  contactAdress?: string;

  gender: number;

  role: number;

  roomSize?: number;

  description?: string;
}
