import { Table, Column, PrimaryKey, ForeignKey } from "sequelize-typescript";
import { BaseEntity } from "../base";
import { RoleSchema } from "./role";

@Table({ tableName: "users" })
export class UserSchema extends BaseEntity {
  @PrimaryKey
  @Column
  id: number;

  @Column
  username: number;

  @Column
  password: string;

  @Column
  @ForeignKey(() => RoleSchema)
  role: number;
}

export const USER_SCHEMA_TOKEN = "USER_SCHEMA";

export * from "./role";
export * from "./rent-provider";
export * from "./tenant";
