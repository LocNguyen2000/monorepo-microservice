import { Column, DataType, ForeignKey, Model, PrimaryKey, Table } from "sequelize-typescript";
import { AccountSchema } from "./account.js";

@Table({ tableName: "sessions", timestamps: false })
export class SessionSchema extends Model<SessionSchema> {
  @PrimaryKey
  @Column({ type: DataType.STRING(36) })
  id: string;

  @ForeignKey(() => AccountSchema)
  @Column({ type: DataType.INTEGER, allowNull: false })
  accountId: number;

  @Column({ type: DataType.DATE, allowNull: false })
  expiresAt: Date;

  @Column({ type: DataType.DATE, allowNull: true })
  deletedAt: Date | null;
}

export type SessionModel = typeof SessionSchema;
