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
  Req,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
import { TokenPayload } from '../auth/auth.service.js';
import { LocationsService } from './locations.service.js';
import { Roles, UserRole } from '../auth/auth.roles.js';

@Controller('location')
export class LocationsController {
  constructor(
    private readonly locationsService: LocationsService,
  ) { }

  @Post()
  @Roles(UserRole.SuperAdministrator, UserRole.Administrator)
  @UseInterceptors(FileInterceptor('image'))
  create(
    @Body() payload: Record<string, unknown>,
    @Req() request: Request & { user: TokenPayload },
    @UploadedFile() image?: Express.Multer.File,
  ) {
    return this.locationsService.create(payload, request.user.sub, image);
  }

  @Get()
  @Roles(UserRole.SuperAdministrator, UserRole.Administrator, UserRole.LocationOperator)
  findAll(
    @Query() query: Record<string, unknown>,
    @Req() request: Request & { user: TokenPayload },
  ) {
    return this.locationsService.findAll(query, request.user.sub);
  }

  @Get(':id')
  @Roles(UserRole.SuperAdministrator, UserRole.Administrator, UserRole.LocationOperator)
  findOne(
    @Param('id') id: string,
    @Req() request: Request & { user: TokenPayload },
  ) {
    return this.locationsService.findOne(+id, request.user.sub);
  }

  @Put(':id')
  @Roles(UserRole.SuperAdministrator, UserRole.Administrator)
  @UseInterceptors(FileInterceptor('image'))
  update(
    @Param('id') id: string,
    @Body() updateLocationDto: Record<string, unknown>,
    @Req() request: Request & { user: TokenPayload },
    @UploadedFile() image?: Express.Multer.File,
  ) {
    return this.locationsService.update(+id, updateLocationDto, request.user.sub, image);
  }

  @Patch(':id')
  @Roles(UserRole.SuperAdministrator, UserRole.Administrator, UserRole.LocationOperator)
  assign(
    @Param('id') id: string,
    @Body() payload: number[],
    @Req() request: Request & { user: TokenPayload },
  ) {
    return this.locationsService.updateExpensesByLocation(+id, payload, request.user.sub);
  }

  @Roles(UserRole.SuperAdministrator, UserRole.Administrator, UserRole.LocationOperator)
  @Patch(':locationCode/expenses/:expenseCode/meter')
  updateMeterReading(
    @Param('locationCode') locationCode: string,
    @Param('expenseCode') expenseCode: string,
    @Body('currentUnit') currentUnit: number,
    @Req() request: Request & { user: TokenPayload },
  ) {
    return this.locationsService.updateMeterReading(
      Number(locationCode),
      Number(expenseCode),
      Number(currentUnit),
      request.user.sub,
    );
  }

  @Delete(':id')
  @Roles(UserRole.SuperAdministrator, UserRole.Administrator)
  remove(
    @Param('id') id: string,
    @Req() request: Request & { user: TokenPayload },
  ) {
    return this.locationsService.remove(+id, request.user.sub);
  }
}
