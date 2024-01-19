import { Column, ForeignKey, PrimaryKey, Table } from "sequelize-typescript";
import { BaseEntity } from "../base";
import { RentProviderSchema } from "./rent-provider";
import { LocationSchema } from "./location";

@Table({ tableName: "tenants" })
export class TenantSchema extends BaseEntity {
  @PrimaryKey
  @Column
  tenantCode: number;

  @Column
  firstName?: string;

  @Column
  lastName?: string;

  @Column
  tenantName: string;

  @Column
  dateOfBirth: Date;

  @Column
  gender: number;

  genderName: string;

  @Column
  phoneNumber: string;

  @Column
  email?: string;

  @Column
  @ForeignKey(() => LocationSchema)
  locationCode?: number;

  @Column
  contactAddress: string;

  @Column
  roomateCount: number;

  @Column
  description?: string;
}

export type TenantModel = typeof TenantSchema;
