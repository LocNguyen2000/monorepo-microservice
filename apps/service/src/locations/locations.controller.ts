import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Query,
  UsePipes,
  Patch,
} from '@nestjs/common';
import { LocationsService } from './locations.service';
import { ExpenseSchema } from '@nhl/schemas/user';

@Controller('location')
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) {}

  @Post()
  create(@Body() payload: Record<string, unknown>) {
    return this.locationsService.create(payload);
  }

  @Get()
  findAll(@Query() query: Record<string, unknown>) {
    return this.locationsService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.locationsService.findOne(+id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateLocationDto: Record<string, unknown>,
  ) {
    return this.locationsService.update(+id, updateLocationDto);
  }

  @Patch(':id')
  assign(@Param('id') id: string, @Body() payload: number[]) {
    return this.locationsService.assignExpensesToLocation(+id, payload);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.locationsService.remove(+id);
  }
}
