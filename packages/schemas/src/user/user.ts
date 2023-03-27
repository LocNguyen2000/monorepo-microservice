// import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Entity, Column, PrimaryGeneratedColumn, BeforeInsert } from "typeorm";
import { IsEnum, IsNumber, IsString } from "class-validator";
import { BaseEntity } from "../base";
import * as bcrypt from "bcrypt";

export enum UserRoles {
  President = "President",
  Manager = "Manager",
  Staff = "Staff",
  Customer = "Customer",
}

@Entity({ name: "users" })
export class User extends BaseEntity {
  @PrimaryGeneratedColumn("increment", { zerofill: true })
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

  @BeforeInsert()
  async beforeInsert() {
    const SALT_ROUND = 12;
    const salt = await bcrypt.genSalt(SALT_ROUND);

    this.password = await bcrypt.hash(this.password, salt);
  }
}
