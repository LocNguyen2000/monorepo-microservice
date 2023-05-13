import { UserRoles } from '@nhl/schemas/user';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { Exclude } from 'class-transformer';
export class UserCreateDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsEnum(UserRoles)
  @IsNotEmpty()
  role: UserRoles;
}

export class UserQueryDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @Exclude({ toPlainOnly: true })
  password: string;

  @IsString()
  @IsNotEmpty()
  role: UserRoles;
}
