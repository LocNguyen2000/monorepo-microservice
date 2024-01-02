import { Column, Model } from "sequelize-typescript";

export class BaseEntity extends Model {
  @Column
  createdAt: Date;

  @Column
  updatedAt: Date;

  @Column
  createdBy: string;

  @Column
  updatedBy: string;
}
