import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, Put } from '@nestjs/common';
import { InvoicesService } from './invoices.service.js';
import { Roles, UserRole } from '../auth/auth.roles.js';
import { InvoiceStatus } from './invoice-status.js';

@Controller('invoices')
export class InvoicesController {
  constructor(private readonly invoiceSvc: InvoicesService) { }

  @Post()
  @Roles(UserRole.SuperAdministrator, UserRole.Administrator, UserRole.LocationOperator)
  create(@Body() payload: Record<string, unknown>) {
    return this.invoiceSvc.create(payload);
  }

  @Get()
  @Roles(UserRole.SuperAdministrator, UserRole.Administrator, UserRole.LocationOperator)
  listInvoices() {
    return this.invoiceSvc.listInvoices();
  }

  @Patch(':id/status')
  @Roles(UserRole.SuperAdministrator, UserRole.Administrator)
  updateStatus(
    @Param('id', ParseIntPipe) invoiceCode: number,
    @Body('status') status: InvoiceStatus,
  ) {
    return this.invoiceSvc.updateStatus(invoiceCode, status);
  }

  @Get('schedules')
  @Roles(UserRole.SuperAdministrator, UserRole.Administrator, UserRole.LocationOperator)
  listSchedules() {
    return this.invoiceSvc.listSchedules();
  }

  @Put('schedules/:locationCode')
  @Roles(UserRole.SuperAdministrator, UserRole.Administrator, UserRole.LocationOperator)
  saveSchedule(
    @Param('locationCode', ParseIntPipe) locationCode: number,
    @Body() payload: Record<string, unknown>,
  ) {
    return this.invoiceSvc.saveSchedule(locationCode, payload);
  }

  @Post('schedules/:locationCode/notify')
  @Roles(UserRole.SuperAdministrator, UserRole.Administrator, UserRole.LocationOperator)
  notifySchedule(@Param('locationCode', ParseIntPipe) locationCode: number) {
    return this.invoiceSvc.notifySchedule(locationCode);
  }

  @Get('get-summerize-data/:locationId')
  @Roles(UserRole.SuperAdministrator, UserRole.Administrator, UserRole.LocationOperator)
  findByLOcationId(@Param('locationId', ParseIntPipe) id: number) {
    return this.invoiceSvc.findOneByLocation(id);
  }

  @Get(':tenantId')
  findByTenantId(@Param('tenantId', ParseIntPipe) id: number) {
    return this.invoiceSvc.findOneByTenantId(id);
  }
}
