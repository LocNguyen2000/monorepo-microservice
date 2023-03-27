import { Column } from "typeorm";
import { IsDate, IsOptional, IsString } from "class-validator";

export class BaseEntity {
  @Column({ default: null })
  @IsOptional()
  @IsDate()
  createdAt?: Date;

  @Column({ default: null })
  @IsOptional()
  @IsDate()
  updatedAt?: Date;

  @Column({ default: "nhloc" })
  @IsOptional()
  @IsString()
  createdBy?: string;

  @Column({ default: "nhloc" })
  @IsOptional()
  @IsString()
  updatedBy?: string;
}

export * from "./pagination";
