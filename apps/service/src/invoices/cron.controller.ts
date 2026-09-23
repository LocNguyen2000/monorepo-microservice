import { Controller, Get, Headers, UnauthorizedException } from '@nestjs/common';
import { Public } from '../auth/auth.decorator.js';
import { InvoicesService } from './invoices.service.js';

@Controller('internal/cron')
export class InvoiceCronController {
  constructor(private readonly invoiceSvc: InvoicesService) { }

  @Public()
  @Get('invoice-schedules')
  sendDueScheduleSummary(@Headers('authorization') authorization?: string) {
    const cronSecret = process.env.CRON_SECRET;
    if (!cronSecret || authorization !== `Bearer ${cronSecret}`) {
      throw new UnauthorizedException('Invalid cron secret');
    }

    return this.invoiceSvc.sendDueScheduleSummary();
  }
}