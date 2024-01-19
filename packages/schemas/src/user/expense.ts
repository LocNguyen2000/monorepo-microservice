import { BelongsToMany, Column, ForeignKey, PrimaryKey, Table } from "sequelize-typescript";
import { BaseEntity } from "../base";
import { LocationSchema } from "./location";
import { ExpenseLocationSchema } from "./expense-location";

@Table({ tableName: "expenses" })
export class ExpenseSchema extends BaseEntity {
  @PrimaryKey
  @Column
  expenseCode: string;

  @Column
  expenseName: string;

  @Column
  type?: string;

  @Column
  price: number;

  @Column
  inUsed: boolean;

  @BelongsToMany(() => LocationSchema, () => ExpenseLocationSchema, "expenseCode")
  // @HasMany(() => ExpenseSchema)
  locations?: Array<any>;
}

export type ExpenseModel = typeof ExpenseSchema;
