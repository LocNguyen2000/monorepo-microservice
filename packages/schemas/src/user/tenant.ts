import { Column, PrimaryKey, Table } from "sequelize-typescript";
import { BaseEntity } from "../base";

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
  contactAddress: string;

  @Column
  roomateCount: number;

  @Column
  description?: string;
}

export const TENANTS_SCHEMA = "TENANTS_SCHEMA";
