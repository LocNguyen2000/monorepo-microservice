import { User, UserRoles } from '@nhl/schemas/user';

export class UserCreateDto extends User {}

export class UserQueryDto {
  username: string;

  role: UserRoles;
}
