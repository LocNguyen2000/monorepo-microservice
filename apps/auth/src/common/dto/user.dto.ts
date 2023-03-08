import { UserRoles } from '@nhl/schemas/user';

export class UserCreateDto {
  username: string;
  password: string;
  role: UserRoles;
}

export class UserSignInDto {
  username: string;
  password: string;
}

export class UserQueryDto {
  _id?: string;
  username?: string;
}
