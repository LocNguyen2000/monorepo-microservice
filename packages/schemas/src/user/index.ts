import { Table, Column, PrimaryKey, ForeignKey, Model, AutoIncrement, Default, DataType } from "sequelize-typescript";
import { RoleSchema } from "./role";

@Table({ tableName: "accounts", timestamps: false })
export class AccountSchema extends Model<AccountSchema>{
  @PrimaryKey
  @Column({ type: DataType.INTEGER, autoIncrement: true })
  id: number;

  @Column
  fullName: string;

  @Column
  email: string;

  @Column
  password: string;

  @ForeignKey(() => RoleSchema)
  @Column({ type: DataType.INTEGER, allowNull: false })  
  role: number;

  @Column({ type: DataType.INTEGER, allowNull: false })  
  status: number;
}

export type AccountModel = typeof AccountSchema;

export * from "./role";
export * from "./rent-provider";
export * from "./tenant";
export * from "./location";
export * from "./expense";
export * from "./expense-location";
