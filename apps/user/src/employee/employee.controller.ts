import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { FilterPagination, Pagination } from '@nhl/schemas/base';
import { EmployeeQueryDto, EmployeeCreateDto } from '~/common/dto/employee.dto';
import { EmployeeService } from './employee.service';

@UsePipes(new ValidationPipe({ transform: true }))
@Controller('Employees')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Get('filter')
  async findAll(
    @Query() payload: EmployeeQueryDto,
    @Pagination() filter: FilterPagination,
  ) {
    return await this.employeeService.findAll(filter, payload);
  }

  @Get(':id')
  async findByCode(@Param('id') id: number) {
    return await this.employeeService.findOneByCode(id);
  }

  @Post()
  async create(@Body() payload: EmployeeCreateDto) {
    return await this.employeeService.create(payload);
  }

  @Delete(':id')
  async delete(@Param('id') id: number) {
    return await this.employeeService.delete(id);
  }
}
