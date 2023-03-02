// import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";
import { IsEnum, IsNumber, IsString } from "class-validator";

export enum UserRoles {
  President = "President",
  Manager = "Manager",
  Staff = "Staff",
  Customer = "Customer",
}

@Entity()
export class User {
  @PrimaryGeneratedColumn({ zerofill: true })
  @IsNumber()
  id: number;

  @Column({ type: String })
  @IsString()
  username: string;

  @Column({ type: String })
  @IsString()
  password: string;

  @Column({ enum: UserRoles })
  @IsEnum(UserRoles)
  role: string;
}
