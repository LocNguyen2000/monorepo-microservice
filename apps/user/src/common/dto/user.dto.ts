import { UserRoles } from '@nhl/schemas/user';

export interface UserCreateDto {
  username: string;
  password: string;
  role: UserRoles;
}

export interface UserQueryDto {
  _id: string;
  username?: string;
}
