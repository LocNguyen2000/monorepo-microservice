import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";
import { IsEnum, IsNumber, IsOptional, IsString } from "class-validator";
import { UserRoles } from "../user";
import { BaseEntity } from "../base";

@Entity({ name: "employees" })
export class Employee extends BaseEntity {
  @PrimaryGeneratedColumn({ zerofill: true })
  @IsNumber()
  employeeCode: number;

  @Column({ type: String })
  @IsOptional()
  @IsString()
  firstName?: string;

  @Column({ type: String })
  @IsOptional()
  @IsString()
  lastName?: string;

  @Column({ type: String })
  @IsString()
  employeeName: string;

  @Column({ enum: UserRoles, type: "enum" })
  @IsEnum(UserRoles)
  role: string;

  @Column({ type: String })
  @IsOptional()
  @IsString()
  dateOfBirth?: Date;

  @Column({ type: String })
  @IsOptional()
  @IsString()
  genderName?: string;

  @Column({ type: String })
  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @Column({ type: String })
  @IsOptional()
  @IsString()
  email?: string;

  @Column({ type: String })
  @IsOptional()
  @IsString()
  contactAdress?: string;
}
