import { BadRequestException, Injectable, NotFoundException, NotImplementedException } from '@nestjs/common';
import { PaginatedQuery } from '../common/pagination.js';
import { RentProvidersService } from '../rent-providers/rent-providers.service.js';
import { TenantService } from '../tenant/tenant.service.js';
import { LocationsService } from '../locations/locations.service.js';
import { ExpenseService } from '../expense/expense.service.js';
import { InjectModel } from '@nestjs/sequelize';
import {
  InvoiceExpenseModel,
  InvoiceExpenseSchema,
  InvoiceModel,
  InvoiceSchema,
  InvoiceScheduleModel,
  InvoiceScheduleSchema,
} from '../common/schema/user/index.js';
import { EnvService } from '@nhl/env';
import { Env } from '../common/env.js';
import { MailSenderClient } from '../common/mail-sender.client.js';
import { InvoiceStatus } from './invoice-status.js';
import { Op } from 'sequelize';
import { AccountSharesService } from '../account-shares/account-shares.service.js';

@Injectable()
export class InvoicesService {
  private readonly mailSenderClient: MailSenderClient;

  constructor(
    private readonly locationSvc: LocationsService,
    private readonly rentProviderSvc: RentProvidersService,
    private readonly tenantSvc: TenantService,
    @InjectModel(InvoiceSchema)
    private readonly invoiceRepository: InvoiceModel,
    @InjectModel(InvoiceExpenseSchema)
    private readonly invoiceExpenseRepository: InvoiceExpenseModel,
    @InjectModel(InvoiceScheduleSchema)
    private readonly scheduleRepository: InvoiceScheduleModel,
    private readonly config: EnvService<Env>,
    private readonly accountSharesService: AccountSharesService,
  ) {
    this.mailSenderClient = new MailSenderClient({
      baseURL: this.config.get('mailjs.url'),
      serviceId: this.config.get('mailjs.serviceId'),
      userId: this.config.get('mailjs.userId'),
      invoiceTemplateId: this.config.get('mailjs.template.invoice'),
      invoiceScheduleTemplateId: this.config.get('mailjs.template.invoiceSchedule'),
      timeoutMs: this.config.get('mailjs.timeoutMs'),
    });
  }

  async create(payload: Record<string, unknown>, accountId: number) {
    const locationCode = Number(payload.locationCode);
    const expenses = Array.isArray(payload.expenses) ? payload.expenses : [];

    if (!locationCode || expenses.length === 0) {
      throw new Error('Location and expenses are required');
    }
    await this.locationSvc.findOwnedOne(locationCode, accountId);
    const expenseCodes = expenses.map((expense: Record<string, unknown>) => Number(expense.expenseCode));
    await this.locationSvc.validateExpensesForLocation(locationCode, expenseCodes, accountId);

    const snapshots = expenses.map((expense: Record<string, unknown>) => {
      const initialUnit = Number(expense.initialUnit || 0);
      const currentUnit = Number(expense.currentUnit || 0);
      const unitPrice = Number(expense.price || 0);

      return {
        expenseCode: Number(expense.expenseCode),
        expenseName: String(expense.expenseName || ''),
        type: String(expense.type || ''),
        unitName: String(expense.unitName || ''),
        initialUnit,
        currentUnit,
        unitPrice,
        amount: (currentUnit - initialUnit) * unitPrice,
      };
    });
    const totalAmount = snapshots.reduce((total, expense) => total + expense.amount, 0);
    const transaction = await this.invoiceRepository.sequelize.transaction();

    try {
      const invoice = await this.invoiceRepository.create(
        { locationCode, totalAmount, status: InvoiceStatus.DRAFT, accountId },
        { transaction },
      );
      await this.invoiceExpenseRepository.bulkCreate(
        snapshots.map((expense) => ({ ...expense, invoiceCode: invoice.invoiceCode })),
        { transaction },
      );
      await transaction.commit();
      return { ...invoice.toJSON(), expenses: snapshots };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async findAll(query: PaginatedQuery, accountId: number) {
    const readableAccountIds = await this.accountSharesService.getReadableAccountIds(accountId);
    return this.invoiceRepository.findAll({
      where: { accountId: { [Op.in]: readableAccountIds } },
      order: [['createdAt', 'DESC']],
    });
  }

  async listInvoices(accountId: number) {
    const readableAccountIds = await this.accountSharesService.getReadableAccountIds(accountId);
    return this.invoiceRepository.findAll({
      where: { accountId: { [Op.in]: readableAccountIds } },
      order: [['createdAt', 'DESC']],
    });
  }

  async updateStatus(invoiceCode: number, status: InvoiceStatus, accountId: number) {
    if (status !== InvoiceStatus.DONE) {
      throw new BadRequestException('Only DRAFT invoices can be marked as DONE');
    }

    const invoice = await this.invoiceRepository.findOne({
      where: { invoiceCode, accountId },
    });
    if (!invoice) throw new NotFoundException('Invoice not found');
    await this.locationSvc.findOwnedOne(invoice.locationCode, accountId);
    if (invoice.status !== InvoiceStatus.DRAFT) {
      throw new BadRequestException('Only DRAFT invoices can be marked as DONE');
    }

    await invoice.update({ status });
    if (status === InvoiceStatus.DONE) {
      await this.scheduleRepository.update(
        { invoiceCode: null },
        { where: { invoiceCode, locationCode: invoice.locationCode } },
      );
    }

    return invoice;
  }

  async listSchedules(accountId: number) {
    const [locations, readableAccountIds] = await Promise.all([
      this.locationSvc.findAll({ page: 1, size: 1000 }, accountId),
      this.accountSharesService.getReadableAccountIds(accountId),
    ]);
    const invoices = await this.invoiceRepository.findAll({
      where: { accountId: { [Op.in]: readableAccountIds } },
      order: [['createdAt', 'DESC']],
    });
    const locationCodes = locations.data.map(({ locationCode }) => Number(locationCode));
    const ownedLocationCodes = new Set(
      locations.data
        .filter(({ accountId: ownerAccountId }) => Number(ownerAccountId) === accountId)
        .map(({ locationCode }) => Number(locationCode)),
    );
    const schedules = await this.scheduleRepository.findAll({
      where: { locationCode: { [Op.in]: locationCodes } },
    });

    for (const schedule of schedules) {
      const assignedInvoice = schedule.invoiceCode
        ? invoices.find((invoice) => invoice.invoiceCode === schedule.invoiceCode)
        : undefined;
      if (
        ownedLocationCodes.has(Number(schedule.locationCode)) &&
        schedule.invoiceCode &&
        assignedInvoice?.status !== InvoiceStatus.DRAFT
      ) {
        await schedule.update({ invoiceCode: null });
      }
    }

    return locations.data.map((location) => {
      const locationCode = Number(location.locationCode);
      const schedule = schedules.find((item) => item.locationCode === locationCode);
      const locationInvoices = invoices.filter(
        (invoice) => invoice.locationCode === locationCode && invoice.status === InvoiceStatus.DRAFT,
      );

      return {
        location,
        schedule: schedule || null,
        invoices: locationInvoices,
      };
    });
  }

  async saveSchedule(locationCode: number, payload: Record<string, unknown>, accountId: number) {
    const location = await this.locationSvc.findOwnedOne(locationCode, accountId);
    const dueDay = Number(payload.dueDay);
    if (dueDay < 1 || dueDay > 28) throw new Error('dueDay must be between 1 and 28');

    const invoiceCode = payload.invoiceCode ? Number(payload.invoiceCode) : undefined;
    if (invoiceCode) {
      const invoice = await this.invoiceRepository.findOne({ where: { invoiceCode, accountId } });
      if (!invoice || invoice.locationCode !== Number(location.locationCode)) {
        throw new NotFoundException('Invoice not found');
      }
      if (invoice.status !== InvoiceStatus.DRAFT) {
        throw new BadRequestException('Only DRAFT invoices can be assigned to a schedule');
      }
    }

    const [schedule] = await this.scheduleRepository.findOrCreate({
      where: { locationCode },
      defaults: {
        locationCode,
        invoiceCode,
        dueDay,
        enabled: payload.enabled !== false,
      },
    });

    return schedule.update({
      invoiceCode,
      dueDay,
      enabled: payload.enabled !== false,
    });
  }

  async notifySchedule(locationCode: number, accountId: number) {
    const location = await this.locationSvc.findOwnedOne(locationCode, accountId);
    const schedule = await this.scheduleRepository.findByPk(locationCode);
    if (!schedule || !schedule.enabled) throw new Error('Schedule is disabled');

    const tenants = await this.tenantSvc.findTenantsByLocation(locationCode, accountId, false);
    if (!tenants.length) throw new Error('Location has no tenants');
    if (!schedule.invoiceCode) throw new Error('No invoice assigned');

    const invoice = await this.invoiceRepository.findOne({
      where: { invoiceCode: schedule.invoiceCode, accountId },
    });
    if (!invoice) throw new NotFoundException('Invoice not found');
    if (!location.owner) throw new Error('Location has no rent provider');

    const provider = await this.rentProviderSvc.findOwnedOne(Number(location.owner), accountId);
    if (!provider?.email) throw new Error('Rent provider has no email');

    const invoiceExpenses = await this.invoiceExpenseRepository.findAll({
      where: { invoiceCode: schedule.invoiceCode },
      order: [['invoiceExpenseCode', 'ASC']],
    });

    const mailResult = await this.mailSenderClient.sendInvoice({
      recipientEmail: provider.email,
      providerName: provider.providerName,
      locationName: location.locationName,
      locationCode,
      invoiceCode: invoice.invoiceCode,
      dueDay: schedule.dueDay,
      total: Number(invoice.totalAmount).toLocaleString('vi-VN'),
      expenses: invoiceExpenses.map((expense) => ({
        name: expense.expenseName,
        type: expense.type,
        units: expense.type === 'per_unit'
          ? `${expense.initialUnit} - ${expense.currentUnit} ${expense.unitName}`
          : expense.unitName,
        unitPrice: Number(expense.unitPrice).toLocaleString('vi-VN'),
        amount: Number(expense.amount).toLocaleString('vi-VN'),
      })),
    });

    if ('error' in mailResult) {
      await schedule.update({
        lastStatus: 'FAILED',
        lastError: mailResult.error,
      });

      return {
        locationCode,
        recipient: 'rent-provider',
        tenantCount: tenants.length,
        status: 'FAILED',
        message: mailResult.error,
      };
    }

    await schedule.update({ lastNotifiedAt: new Date(), lastStatus: 'SENT', lastError: null });
    return {
      locationCode,
      invoiceCode: schedule.invoiceCode,
      recipient: 'rent-provider',
      tenantCount: tenants.length,
      status: 'SENT',
      message: 'Invoice notification sent to the rent provider',
    };
  }

  async sendDueScheduleSummary() {
    const dateParts = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Asia/Ho_Chi_Minh',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).formatToParts(new Date());
    const dateValues = Object.fromEntries(dateParts.map(({ type, value }) => [type, value]));
    const dueDate = `${dateValues.year}-${dateValues.month}-${dateValues.day}`;
    const dueDay = Number(dateValues.day);

    const [schedules, locationsResult] = await Promise.all([
      this.scheduleRepository.findAll({ where: { dueDay, enabled: true } }),
      this.locationSvc.findAllForSystem({ page: 1, size: 1000 }),
    ]);
    if (schedules.length === 0) {
      return {
        dueDate,
        scheduleCount: 0,
        status: 'SKIPPED',
        message: 'No invoice schedules are due today',
      };
    }

    const locations = new Map(
      locationsResult.data.map((location) => [Number(location.locationCode), location]),
    );
    const scheduleList = schedules.map((schedule) => {
      const location = locations.get(Number(schedule.locationCode));
      return [
        `Location: ${location?.locationName || 'Unknown'}`,
        `Location code: ${schedule.locationCode}`,
        `Invoice code: ${schedule.invoiceCode || 'Not assigned'}`,
        `Due day: ${schedule.dueDay}`,
      ].join(' | ');
    }).join('\n');

    const mailResult = await this.mailSenderClient.sendInvoiceScheduleSummary({
      recipientEmail: this.config.get('mailjs.adminEmail'),
      scheduleDate: dueDate,
      scheduleCount: schedules.length,
      scheduleList,
    });
    if ('error' in mailResult) {
      return {
        dueDate,
        scheduleCount: schedules.length,
        status: 'FAILED',
        message: mailResult.error,
      };
    }

    return {
      dueDate,
      scheduleCount: schedules.length,
      status: 'SENT',
      message: 'Invoice schedule summary sent',
    };
  }

  async findOneByTenantId(id: number, accountId: number) {
    const result = {};
    const tenant = await this.tenantSvc.findOne(id, accountId);
    Object.assign(result, { tenant });
    const assignments = await this.tenantSvc.findLocationsByTenant(id, accountId);
    const [assignment] = assignments;
    if (assignment) {
      const location = await this.locationSvc.findOne(assignment.locationCode, accountId);
      Object.assign(result, { location });
      if (location.owner) {
        const owner = await this.rentProviderSvc.findOne(+location.owner, accountId);
        Object.assign(result, { owner });
      }
    }

    return result;
  }

  async findOneByLocation(id: number, accountId: number) {
    const result = {};
    const location = await this.locationSvc.findOne(id, accountId);

    const tenants =
      (await this.tenantSvc.findTenantsByLocation(+location.locationCode, accountId)) ||
      [];

    const owner = await this.rentProviderSvc.findOne(+location.owner, accountId);

    Object.assign(result, { location, tenants, owner });

    return result;
  }

  async update(id: number, payload: Record<string, unknown>) {
    throw new NotImplementedException();
  }

  async remove(id: number) {
    throw new NotImplementedException();
  }
}
