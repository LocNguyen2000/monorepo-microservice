import { Module } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { Employee } from '@nhl/schemas/employee';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployeeController } from './employee.controller';
@Module({
  imports: [TypeOrmModule.forFeature([Employee])],
  providers: [EmployeeService],
  controllers: [EmployeeController],
})
export class EmployeeModule {}
