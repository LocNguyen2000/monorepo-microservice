import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
  Query,
  UsePipes,
} from '@nestjs/common';
import { TenantService } from './tenant.service';
import { PaginatedQuery } from '~/common/pagination';

@Controller('tenant')
export class TenantController {
  constructor(private readonly tenantService: TenantService) {}

  @Post()
  create(@Body() createTenantDto: Record<string, unknown>) {
    return this.tenantService.create(createTenantDto);
  }

  @Get()
  findAll(@Query() query: Record<string, unknown>) {
    return this.tenantService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tenantService.findOne(+id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateTenantDto: Record<string, unknown>,
  ) {
    return this.tenantService.update(+id, updateTenantDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tenantService.remove(+id);
  }
}
