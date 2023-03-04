import { Employee } from '@nhl/schemas/employee';
import { UserRoles } from '@nhl/schemas/user';
import { IsOptional } from 'class-validator';

export class EmployeeCreateDto extends Employee {}
export class EmployeeQueryDto {
  @IsOptional()
  employeeCode?: number;

  @IsOptional()
  firstName?: string;

  @IsOptional()
  lastName?: string;

  @IsOptional()
  employeeName?: string;

  @IsOptional()
  role?: UserRoles;

  @IsOptional()
  dateOfBirth?: Date;

  @IsOptional()
  genderName?: string;

  @IsOptional()
  phoneNumber?: string;

  @IsOptional()
  email?: string;

  @IsOptional()
  contactAdress?: string;
}
