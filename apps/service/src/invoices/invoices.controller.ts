import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { InvoicesService } from './invoices.service';

@Controller('invoices')
export class InvoicesController {
  constructor(private readonly invoiceSvc: InvoicesService) {}

  @Get('get-summerize-data/:locationId')
  findByLOcationId(@Param('locationId', ParseIntPipe) id: number) {
    return this.invoiceSvc.findOneByLocation(id);
  }

  @Get(':tenantId')
  findByTenantId(@Param('tenantId', ParseIntPipe) id: number) {
    return this.invoiceSvc.findOneByTenantId(id);
  }
}
