import { SetMetadata } from '@nestjs/common';

export enum UserRole {
    SuperAdministrator = 1,
    Administrator = 2,
    User = 3,
}

export const ROLES_KEY = 'roles';
export const ADMIN_ROLES = [UserRole.SuperAdministrator, UserRole.Administrator];
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);