import { IsNumber, IsString } from 'class-validator';

export class LoginPayload {
  @IsString()
  email: string;

  @IsString()
  password: string;

  @IsString()
  clientId: string;
}

export class RegisterPayload {
  @IsString()
  fullName: string;

  @IsString()
  email: string;

  @IsString()
  password: string;

  @IsNumber()
  role: number;
}

export class ConfirmRegisterPayload {
  @IsString()
  email: string;

  @IsNumber()
  code: number;
}

export class ConfirmEmailPayload {
  @IsString()
  recepientEmail: string;

  @IsString()
  fullName: string;

  @IsNumber()
  code: number;
}
