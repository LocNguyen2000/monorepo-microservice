import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

export type EmployeeDocument = Employee;

@Schema({ collection: "employee", timestamps: true })
export class Employee {
  @Prop()
  employeeId: number;

  @Prop()
  employeeCode: string;

  @Prop()
  firstName?: string;

  @Prop()
  lastName?: string;

  @Prop()
  employeeName: string;

  @Prop()
  dateOfBirth: Date;

  @Prop()
  genderName?: string;

  @Prop()
  phoneNumber?: string;

  @Prop()
  email?: string;

  @Prop()
  contactAdress?: string;

  @Prop()
  workStatus?: number;

  @Prop()
  workStatusName?: string;
}

export const EmployeeSchema = SchemaFactory.createForClass(Employee);
