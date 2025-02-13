export interface IAuthUser {
    accountId: number;
    fullName: string;
    accessToken: string;
    refreshToken: string;
    email: string;
    role: number;
  }