import { IsString, IsNumber, IsNotEmpty } from 'class-validator';

export class CreateClientDto {
  @IsString()
  @IsNotEmpty()
  clientId: string;

  @IsString()
  @IsNotEmpty()
  clientSecret: string;

  @IsString()
  redirectUris: string;

  @IsNumber()
  accessTimeout: number;

  @IsNumber()
  refreshTimeout: number;
}

export class UpdateClientDto {
  @IsString()
  clientId?: string;

  @IsString()
  clientSecret?: string;

  @IsString()
  redirectUris?: string;

  @IsNumber()
  accessTimeout?: number;

  @IsNumber()
  refreshTimeout?: number;
}

export class CreateAuthCodeDto {
  @IsNumber()
  @IsNotEmpty()
  code: number;

  @IsNumber()
  @IsNotEmpty()
  accountId: number;

  @IsString()
  @IsNotEmpty()
  codeType: string; // e.g., "email_verification", "password_reset"

  @IsNumber()
  @IsNotEmpty()
  expiresAt: number;
}
