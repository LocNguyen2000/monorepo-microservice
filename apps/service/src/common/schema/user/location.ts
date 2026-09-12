import { BelongsToMany, Column, ForeignKey, Model, PrimaryKey, Table } from "sequelize-typescript";
import { RentProviderSchema } from "./rent-provider";
import { ExpenseSchema } from "./expense";
import { ExpenseLocationSchema } from "./expense-location";

@Table({ tableName: "locations", timestamps: false })
export class LocationSchema extends Model {
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
  expenses?: Array<any>;
}

export type LocationModel = typeof LocationSchema;