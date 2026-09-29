import { Column, DataType, ForeignKey, Model, PrimaryKey, Table } from 'sequelize-typescript';
import { AccountSchema } from './account.js';

@Table({
  tableName: 'account_shares',
  timestamps: false,
  indexes: [
    { unique: true, fields: ['ownerAccountId', 'sharedAccountId'] },
    { fields: ['sharedAccountId'] },
  ],
})
export class AccountShareSchema extends Model<AccountShareSchema> {
  @PrimaryKey
  @ForeignKey(() => AccountSchema)
  @Column({ type: DataType.INTEGER, allowNull: false })
  ownerAccountId: number;

  @PrimaryKey
  @ForeignKey(() => AccountSchema)
  @Column({ type: DataType.INTEGER, allowNull: false })
  sharedAccountId: number;
}

export type AccountShareModel = typeof AccountShareSchema;