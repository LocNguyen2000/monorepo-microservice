import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ExpenseService } from './expense.service';

@Controller('expense')
export class ExpenseController {
  constructor(private readonly expense: ExpenseService) {}

  @Post()
  create(@Body() payload: Record<string, unknown>) {
    return this.expense.create(payload);
  }

  @Get()
  findAll(@Query() query: Record<string, unknown>) {
    return this.expense.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.expense.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() payload: Record<string, unknown>) {
    return this.expense.update(+id, payload);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.expense.remove(+id);
  }
}
