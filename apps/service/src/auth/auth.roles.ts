import { SetMetadata } from '@nestjs/common';

export enum UserRole {
    SuperAdministrator = 1,
    Administrator = 2,
    User = 3,
}

export enum AccountStatus {
    Inactive = 0,
    Active = 1,
}

export const ROLES_KEY = 'roles';
export const ADMIN_ROLES = [UserRole.SuperAdministrator, UserRole.Administrator];
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);