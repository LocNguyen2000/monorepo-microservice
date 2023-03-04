import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Employee } from '@nhl/schemas/employee';
import { InjectRepository } from '@nestjs/typeorm';
import { EmployeeCreateDto, EmployeeQueryDto } from '~/common/dto/employee.dto';
import { PaginationResponse, FilterPagination } from '@nhl/schemas/base';

@Injectable()
export class EmployeeService {
  constructor(
    @InjectRepository(Employee)
    private readonly employeeRepo: Repository<Employee>,
  ) {}

  async findOneByCode(employeeCode: number): Promise<Employee> {
    const response = await this.employeeRepo.findOne({
      where: { employeeCode },
    });
    return response;
  }

  async findAll(
    filter: FilterPagination,
    payload: EmployeeQueryDto,
  ): Promise<PaginationResponse<Employee[]>> {
    console.log('payload >', payload);
    console.log('filter >', filter);

    const response = await this.employeeRepo
      .createQueryBuilder('e')
      .select([
        'e.employeeCode',
        'e.firstName',
        'e.lastName',
        'e.employeeName',
        'e.role',
        'e.genderName',
        'e.phoneNumber',
        'e.email',
        'e.contactAdress',
      ])
      .where(payload)
      .limit(filter.size)
      .offset((filter.page - 1) * filter.size)
      .getManyAndCount();

    return {
      page: filter.page,
      offset: (filter.page - 1) * filter.size,
      total: response[1],
      data: response[0],
    };
  }

  async create(payload: EmployeeCreateDto): Promise<Employee> {
    const response = this.employeeRepo.create(payload);
    return response;
  }

  async delete(employeeCode: number): Promise<number> {
    const { affected } = await this.employeeRepo.softDelete(employeeCode);
    return affected;
  }
}
