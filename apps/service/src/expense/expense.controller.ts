import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { TokenPayload } from '../auth/auth.service.js';
import { ExpenseService } from './expense.service.js';
import { Roles, UserRole } from '../auth/auth.roles.js';

@Controller('expense')
@Roles(UserRole.SuperAdministrator, UserRole.Administrator)
export class ExpenseController {
  constructor(private readonly expense: ExpenseService) {}

  @Post()
  create(
    @Body() payload: Record<string, unknown>,
    @Req() request: Request & { user: TokenPayload },
  ) {
    return this.expense.create(payload, request.user.sub);
  }

  @Get()
  findAll(
    @Query() query: Record<string, unknown>,
    @Req() request: Request & { user: TokenPayload },
  ) {
    return this.expense.findAll(query, request.user.sub);
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
    @Req() request: Request & { user: TokenPayload },
  ) {
    return this.expense.findOne(+id, request.user.sub);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() payload: Record<string, unknown>,
    @Req() request: Request & { user: TokenPayload },
  ) {
    return this.expense.update(+id, payload, request.user.sub);
  }

  @Delete(':id')
  remove(
    @Param('id') id: string,
    @Req() request: Request & { user: TokenPayload },
  ) {
    return this.expense.remove(+id, request.user.sub);
  }
}
