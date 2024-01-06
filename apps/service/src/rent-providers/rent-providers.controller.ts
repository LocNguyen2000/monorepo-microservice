import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { RentProvidersService } from './rent-providers.service';

@Controller('rent-providers')
export class RentProvidersController {
  constructor(private readonly rentProvider: RentProvidersService) {}

  @Post()
  create(@Body() payload: Record<string, unknown>) {
    return this.rentProvider.create(payload);
  }

  @Get()
  findAll() {
    return this.rentProvider.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.rentProvider.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() payload: Record<string, unknown>) {
    return this.rentProvider.update(+id, payload);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.rentProvider.remove(+id);
  }
}
