import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  Query,
} from '@nestjs/common';
import { Request } from 'express';
import { TokenPayload } from '../auth/auth.service.js';
import { RentProvidersService } from './rent-providers.service.js';

@Controller('rent-provider')
export class RentProvidersController {
  constructor(private readonly rentProvider: RentProvidersService) {}

  @Post()
  create(
    @Body() payload: Record<string, unknown>,
    @Req() request: Request & { user: TokenPayload },
  ) {
    return this.rentProvider.create(payload, request.user.sub);
  }

  @Get()
  findAll(
    @Query() query: Record<string, unknown>,
    @Req() request: Request & { user: TokenPayload },
  ) {
    return this.rentProvider.findAll(query, request.user.sub);
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
    @Req() request: Request & { user: TokenPayload },
  ) {
    return this.rentProvider.findOne(+id, request.user.sub);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() payload: Record<string, unknown>,
    @Req() request: Request & { user: TokenPayload },
  ) {
    return this.rentProvider.update(+id, payload, request.user.sub);
  }

  @Delete(':id')
  remove(
    @Param('id') id: string,
    @Req() request: Request & { user: TokenPayload },
  ) {
    return this.rentProvider.remove(+id, request.user.sub);
  }
}
