import { UserRoles } from '@nhl/schemas/user';

export interface EmployeeCreateDto {
  employeeCode: number;

  firstName?: string;

  lastName?: string;

  employeeName: string;

  role: UserRoles;

  dateOfBirth: Date;

  genderName?: string;

  phoneNumber?: string;

  email?: string;

  contactAdress?: string;

  createdBy: string;

  updatedBy: string;
}
