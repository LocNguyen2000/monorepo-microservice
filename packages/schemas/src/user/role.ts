import {
  Column,
  PrimaryKey,
  Table,
  Model,
  AllowNull,
} from "sequelize-typescript";
import { BaseEntity } from "../base";

@Table({ tableName: "roles" })
export class RoleSchema extends BaseEntity {
  @PrimaryKey
  @AllowNull(false)
  @Column
  id: number;

  @Column
  role: string;
}

export const ROLE_SCHEMA = "ROLE_SCHEMA";
