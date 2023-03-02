import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";
import { IsEnum, IsNumber, IsOptional, IsString } from "class-validator";
import { UserRoles } from "../user";

@Entity()
export class Employee {
  @PrimaryGeneratedColumn({ zerofill: true })
  @IsNumber()
  employeeCode: number;

  @Column()
  @IsOptional()
  @IsString()
  firstName?: string;

  @Column()
  @IsOptional()
  @IsString()
  lastName?: string;

  @Column()
  @IsString()
  employeeName: string;

  @Column({ enum: UserRoles })
  @IsEnum(UserRoles)
  role: string;

  @Column()
  @IsString()
  dateOfBirth: Date;

  @Column()
  @IsOptional()
  @IsString()
  genderName?: string;

  @Column()
  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @Column()
  @IsOptional()
  @IsString()
  email?: string;

  @Column()
  @IsOptional()
  @IsString()
  contactAdress?: string;

  @Column()
  @IsString()
  createdBy: string;

  @Column()
  @IsString()
  updatedBy: string;
}
