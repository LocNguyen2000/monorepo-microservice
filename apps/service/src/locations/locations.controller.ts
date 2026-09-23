import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Query,
  Patch,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { LocationsService } from './locations.service.js';
import { Roles, UserRole } from '../auth/auth.roles.js';

@Controller('location')
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) { }

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  create(
    @Body() payload: Record<string, unknown>,
    @UploadedFile() image?: Express.Multer.File,
  ) {
    return this.locationsService.create(payload, image);
  }

  @Get()
  @Roles(UserRole.SuperAdministrator, UserRole.Administrator, UserRole.LocationOperator)
  findAll(@Query() query: Record<string, unknown>) {
    return this.locationsService.findAll(query);
  }

  @Get(':id')
  @Roles(UserRole.SuperAdministrator, UserRole.Administrator, UserRole.LocationOperator)
  findOne(@Param('id') id: string) {
    return this.locationsService.findOne(+id);
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('image'))
  update(
    @Param('id') id: string,
    @Body() updateLocationDto: Record<string, unknown>,
    @UploadedFile() image?: Express.Multer.File,
  ) {
    return this.locationsService.update(+id, updateLocationDto, image);
  }

  @Patch(':id')
  @Roles(UserRole.SuperAdministrator, UserRole.Administrator, UserRole.LocationOperator)
  assign(@Param('id') id: string, @Body() payload: number[]) {
    return this.locationsService.updateExpensesByLocation(+id, payload);
  }

  @Roles(UserRole.SuperAdministrator, UserRole.Administrator, UserRole.LocationOperator)
  @Patch(':locationCode/expenses/:expenseCode/meter')
  updateMeterReading(
    @Param('locationCode') locationCode: string,
    @Param('expenseCode') expenseCode: string,
    @Body('currentUnit') currentUnit: number,
  ) {
    return this.locationsService.updateMeterReading(
      Number(locationCode),
      Number(expenseCode),
      Number(currentUnit),
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.locationsService.remove(+id);
  }
}
