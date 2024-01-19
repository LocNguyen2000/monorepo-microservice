import { BelongsToMany, Column, ForeignKey, HasMany, PrimaryKey, Table } from "sequelize-typescript";
import { BaseEntity } from "../base";
import { RentProviderSchema } from "./rent-provider";
import { ExpenseSchema } from "./expense";
import { ExpenseLocationSchema } from "./expense-location";

@Table({ tableName: "locations" })
export class LocationSchema extends BaseEntity {
  @PrimaryKey
  @Column
  locationCode: string;

  @Column
  locationName: string;

  @Column
  locationAddress: string;

  @Column
  roomSize: number;

  @Column
  description?: string;

  @Column
  @ForeignKey(() => RentProviderSchema)
  owner?: string;

  @Column
  image?: string;

  @BelongsToMany(() => ExpenseSchema, () => ExpenseLocationSchema, "locationCode")
  // @HasMany(() => ExpenseSchema)
  expenses?: Array<any>;
}

export type LocationModel = typeof LocationSchema;
