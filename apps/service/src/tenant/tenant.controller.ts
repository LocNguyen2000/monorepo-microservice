import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Query,
  UploadedFile,
  UseInterceptors,
  Req,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { TenantService } from './tenant.service.js';
import { Request } from 'express';
import { TokenPayload } from '../auth/auth.service.js';
import 'multer';

@Controller('tenant')
export class TenantController {
  constructor(private readonly tenantService: TenantService) { }

  @Post()
  @UseInterceptors(FileInterceptor('contract'))
  create(
    @Body() createTenantDto: Record<string, unknown>,
    @Req() request: Request & { user: TokenPayload },
    @UploadedFile() contract?: Express.Multer.File,
  ) {
    return this.tenantService.create(createTenantDto, request.user.sub, contract);
  }

  @Get()
  findAll(
    @Query() query: Record<string, unknown>,
    @Req() request: Request & { user: TokenPayload },
  ) {
    return this.tenantService.findAll(query, request.user.sub);
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
    @Req() request: Request & { user: TokenPayload },
  ) {
    return this.tenantService.findOne(+id, request.user.sub);
  }

  @Post(':tenantCode/locations/:locationCode')
  assignLocation(
    @Param('tenantCode') tenantCode: string,
    @Param('locationCode') locationCode: string,
    @Req() request: Request & { user: TokenPayload },
  ) {
    return this.tenantService.assignLocation(+tenantCode, +locationCode, request.user.sub);
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('contract'))
  update(
    @Param('id') id: string,
    @Body() updateTenantDto: Record<string, unknown>,
    @Req() request: Request & { user: TokenPayload },
    @UploadedFile() contract?: Express.Multer.File,
  ) {
    return this.tenantService.update(+id, updateTenantDto, request.user.sub, contract);
  }

  @Delete(':id')
  remove(
    @Param('id') id: string,
    @Req() request: Request & { user: TokenPayload },
  ) {
    return this.tenantService.remove(+id, request.user.sub);
  }
}
