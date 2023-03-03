import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Employee } from '@nhl/schemas/employee';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class EmployeeService {
  constructor(
    @InjectRepository(Employee)
    private readonly employeeRepo: Repository<Employee>,
  ) {}

  create() {
    return this.employeeRepo.create();
  }
  //   async findOne() {}
  //   async findAll() {}
  //   async update() {}
  //   async delete() {}
}
