export interface UserCreateDto {
  username: string;
  password: string;
}

export interface UserQueryDto {
  _id: string;
  username?: string;
}
