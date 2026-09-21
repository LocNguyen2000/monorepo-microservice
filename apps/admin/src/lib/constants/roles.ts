export enum UserRole {
    SuperAdministrator = 1,
    Administrator = 2,
    User = 3,
}

export enum AccountStatus {
    Inactive = 0,
    Active = 1,
}

export const ADMIN_ROLES = [UserRole.SuperAdministrator, UserRole.Administrator];