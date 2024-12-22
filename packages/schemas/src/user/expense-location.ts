import { Column, ForeignKey, PrimaryKey, Table, Model, DataType } from "sequelize-typescript";
import { LocationSchema } from "./location";
import { ExpenseSchema } from "./expense";
import { BaseEntity } from "../base";

@Table({
  modelName: "expenses_location",
  tableName: "expenses_location",
  indexes: [
    {
      unique: true,
      fields: ["locationCode", "expenseCode"],
    },
  ],
})
export class ExpenseLocationSchema extends BaseEntity {
  @ForeignKey(() => ExpenseSchema)
  @Column({ unique: false })
  expenseCode: number;

  @ForeignKey(() => LocationSchema)
  @Column({ unique: false })
  locationCode: number;

  @Column({type: DataType.INTEGER})
  initialUnit: number
  
  @Column({type: DataType.INTEGER})
  currentUnit: number
}


export type ExpenseLocationModel = typeof ExpenseLocationSchema;
