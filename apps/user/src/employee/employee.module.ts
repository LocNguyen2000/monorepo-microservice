import { Module } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { EmployeeController } from './employee.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { DbConnection } from '~/common/const';
import { Employee, EmployeeSchema } from '@nhl/schemas/employee';
@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: Employee.name, schema: EmployeeSchema }],
      DbConnection.User,
    ),
  ],
  providers: [EmployeeService],
  controllers: [EmployeeController],
})
export class EmployeeModule {}
