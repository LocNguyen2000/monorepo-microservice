import { Column, ForeignKey, PrimaryKey, Table } from "sequelize-typescript";
import { BaseEntity } from "../base";
import { RentProviderSchema } from "./rent-provider";

@Table({ tableName: "locations" })
export class LocationSchema extends BaseEntity {
  @PrimaryKey
  @Column
  locationCode: string;

  @Column
  locationAddress: string;

  @Column
  roomCount: number;

  @Column
  description?: string;

  @Column
  @ForeignKey(() => RentProviderSchema)
  owner?: string;

  @Column
  image?: string;
}
