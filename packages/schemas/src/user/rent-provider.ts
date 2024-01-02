import { Column, ForeignKey, PrimaryKey, Table } from "sequelize-typescript";
import { BaseEntity } from "../base";
import { RoleSchema } from "./role";

@Table({ tableName: "rent_providers" })
export class RentProviderSchema extends BaseEntity {
  @PrimaryKey
  @Column
  providerCode: number;

  @Column
  providerName: string;

  @Column
  firstName?: string;

  @Column
  lastName?: string;

  @Column
  dateOfBirth: Date;

  @Column
  phoneNumber: string;

  @Column
  email?: string;

  @Column
  contactAdress?: string;

  @Column
  gender: number;

  genderName: string;

  @Column
  @ForeignKey(() => RoleSchema)
  role: number;

  //   @Column
  //   tenants?: any[];

  @Column
  roomSize?: number;

  @Column
  description?: string;
}

export const RENT_PROVIDER_SCHEMA = "RENT_PROVIDER_SCHEMA";
