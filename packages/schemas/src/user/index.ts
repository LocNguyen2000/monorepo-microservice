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

export type UserModel = typeof UserSchema;

export * from "./role";
export * from "./rent-provider";
export * from "./tenant";
export * from "./location";
