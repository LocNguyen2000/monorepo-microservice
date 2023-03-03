// import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  EntityRepository,
  Repository,
} from "typeorm";
import { IsEnum, IsNumber, IsString } from "class-validator";
import { BaseEntity } from "../base";

export enum UserRoles {
  President = "President",
  Manager = "Manager",
  Staff = "Staff",
  Customer = "Customer",
}

@Entity({ name: "users" })
export class User extends BaseEntity {
  @PrimaryGeneratedColumn({ zerofill: true })
  @IsNumber()
  id: number;

  @Column({ type: String })
  @IsString()
  username: string;

  @Column({ type: String })
  @IsString()
  password: string;

  @Column({ enum: UserRoles, type: "enum" })
  @IsEnum(UserRoles)
  role: string;
}
