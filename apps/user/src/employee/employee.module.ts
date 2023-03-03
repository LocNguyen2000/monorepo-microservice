import { Module } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { Employee } from '@nhl/schemas/employee';
import { TypeOrmModule } from '@nestjs/typeorm';
@Module({
  imports: [
    TypeOrmModule.forFeature([Employee], {
      type: 'mysql',
    }),
  ],
  providers: [EmployeeService],
})
export class EmployeeModule {}
