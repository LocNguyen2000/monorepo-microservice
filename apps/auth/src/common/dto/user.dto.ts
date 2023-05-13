import { UserRoles } from '@nhl/schemas/user';
import { Exclude, Expose } from 'class-transformer';
import { IsOptional, IsString, IsEnum } from 'class-validator';

export class UserCreateDto {
  @IsOptional()
  @IsString()
  @Expose()
  id?: string;

  @IsString()
  @Expose()
  username: string;

  @IsString()
  @Exclude()
  password: string;

  @IsEnum(UserRoles)
  @Expose()
  role: UserRoles;
}

export class UserSignInDto {
  @IsString()
  username: string;

  @IsString()
  password: string;
}

export class UserQueryDto {
  @IsOptional()
  @IsString()
  id?: string;

  @IsOptional()
  @IsString()
  username?: string;

  @IsOptional()
  @IsEnum(UserRoles)
  role?: UserRoles;
}
