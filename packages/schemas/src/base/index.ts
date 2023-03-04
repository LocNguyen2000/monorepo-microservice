import { Column } from "typeorm";
import { IsDate, IsOptional, IsString } from "class-validator";

export class BaseEntity {
  @Column()
  @IsOptional()
  @IsDate()
  createdAt?: Date;

  @Column()
  @IsOptional()
  @IsDate()
  updatedAt?: Date;

  @Column()
  @IsOptional()
  @IsString()
  createdBy?: string;

  @Column()
  @IsOptional()
  @IsString()
  updatedBy?: string;
}

export * from "./pagination";
