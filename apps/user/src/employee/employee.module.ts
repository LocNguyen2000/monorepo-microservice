import { Module } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { Employee } from '@nhl/schemas/employee';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployeeController } from './employee.controller';
import { DbConnection } from '~/common';
@Module({
  imports: [TypeOrmModule.forFeature([Employee], DbConnection.User)],
  providers: [EmployeeService],
  controllers: [EmployeeController],
})
export class EmployeeModule {}
