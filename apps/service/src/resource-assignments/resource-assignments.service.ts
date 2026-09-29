import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op, Transaction } from 'sequelize';
import { AccountModel, AccountSchema } from '../common/schema/auth/account.js';
import {
  ExpenseLocationModel,
  ExpenseLocationSchema,
  ExpenseModel,
  ExpenseSchema,
  InvoiceModel,
  InvoiceSchema,
  LocationModel,
  LocationSchema,
  RentProviderModel,
  RentProviderSchema,
  TenantLocationModel,
  TenantLocationSchema,
  TenantModel,
  TenantSchema,
} from '../common/schema/user/index.js';
import { AssignableResourceType } from './resource-assignments.dto.js';

type OwnedResource = {
  accountId?: number | null;
  update(
    values: { accountId: number },
    options: { transaction: Transaction },
  ): Promise<unknown>;
};

@Injectable()
export class ResourceAssignmentsService {
  constructor(
    @InjectModel(AccountSchema)
    private readonly accountModel: AccountModel,
    @InjectModel(TenantSchema)
    private readonly tenantModel: TenantModel,
    @InjectModel(LocationSchema)
    private readonly locationModel: LocationModel,
    @InjectModel(InvoiceSchema)
    private readonly invoiceModel: InvoiceModel,
    @InjectModel(RentProviderSchema)
    private readonly rentProviderModel: RentProviderModel,
    @InjectModel(TenantLocationSchema)
    private readonly tenantLocationModel: TenantLocationModel,
    @InjectModel(ExpenseLocationSchema)
    private readonly expenseLocationModel: ExpenseLocationModel,
    @InjectModel(ExpenseSchema)
    private readonly expenseModel: ExpenseModel,
  ) {}

  async assignAccount(
    resourceType: AssignableResourceType,
    resourceId: number,
    accountId: number,
  ) {
    return this.accountModel.sequelize.transaction(async (transaction) => {
      const account = await this.accountModel.findByPk(accountId, { transaction });
      if (!account) throw new NotFoundException('Account not found');

      const resource = await this.findResource(resourceType, resourceId, transaction);
      if (!resource) throw new NotFoundException('Resource not found');

      if (resource.accountId != null && Number(resource.accountId) !== accountId) {
        throw new ConflictException('Resource is already assigned to another account');
      }

      await this.assertLinkedAccountsMatch(
        resourceType,
        resourceId,
        accountId,
        resource,
        transaction,
      );

      const alreadyAssigned = resource.accountId != null;
      if (!alreadyAssigned) {
        await resource.update({ accountId }, { transaction });
      }

      return {
        resourceType,
        resourceId,
        accountId,
        alreadyAssigned,
      };
    });
  }

  private findResource(
    resourceType: AssignableResourceType,
    resourceId: number,
    transaction: Transaction,
  ) {
    const options = { transaction, lock: transaction.LOCK.UPDATE };
    switch (resourceType) {
      case AssignableResourceType.Tenant:
        return this.tenantModel.findByPk(resourceId, options);
      case AssignableResourceType.Location:
        return this.locationModel.findByPk(resourceId, options);
      case AssignableResourceType.Invoice:
        return this.invoiceModel.findByPk(resourceId, options);
      case AssignableResourceType.RentProvider:
        return this.rentProviderModel.findByPk(resourceId, options);
    }
  }

  private async assertLinkedAccountsMatch(
    resourceType: AssignableResourceType,
    resourceId: number,
    accountId: number,
    resource: OwnedResource,
    transaction: Transaction,
  ) {
    switch (resourceType) {
      case AssignableResourceType.RentProvider: {
        const locations = await this.locationModel.findAll({
          attributes: ['accountId'],
          where: { owner: String(resourceId) },
          transaction,
        });
        this.assertCompatibleAccounts(locations, accountId);
        return;
      }
      case AssignableResourceType.Tenant: {
        const links = await this.tenantLocationModel.findAll({
          attributes: ['locationCode'],
          where: { tenantCode: resourceId },
          transaction,
        });
        const locations = links.length
          ? await this.locationModel.findAll({
              attributes: ['accountId'],
              where: {
                locationCode: { [Op.in]: links.map(({ locationCode }) => locationCode) },
              },
              transaction,
            })
          : [];
        this.assertCompatibleAccounts(locations, accountId);
        return;
      }
      case AssignableResourceType.Invoice: {
        const invoice = resource as InvoiceSchema;
        const location = await this.locationModel.findByPk(invoice.locationCode, {
          attributes: ['accountId'],
          transaction,
        });
        if (!location) throw new ConflictException('Invoice location was not found');
        this.assertCompatibleAccounts([location], accountId);
        return;
      }
      case AssignableResourceType.Location: {
        const location = resource as LocationSchema;
        if (location.owner) {
          const owner = await this.rentProviderModel.findByPk(location.owner, {
            attributes: ['accountId'],
            transaction,
          });
          if (!owner) throw new ConflictException('Location owner was not found');
          this.assertCompatibleAccounts([owner], accountId);
        }

        const [tenantLinks, invoices, expenseLinks] = await Promise.all([
          this.tenantLocationModel.findAll({
            attributes: ['tenantCode'],
            where: { locationCode: resourceId },
            transaction,
          }),
          this.invoiceModel.findAll({
            attributes: ['accountId'],
            where: { locationCode: resourceId },
            transaction,
          }),
          this.expenseLocationModel.findAll({
            attributes: ['expenseCode'],
            where: { locationCode: resourceId },
            transaction,
          }),
        ]);

        const tenants = tenantLinks.length
          ? await this.tenantModel.findAll({
              attributes: ['accountId'],
              where: {
                tenantCode: { [Op.in]: tenantLinks.map(({ tenantCode }) => tenantCode) },
              },
              transaction,
            })
          : [];
        const expenses = expenseLinks.length
          ? await this.expenseModel.findAll({
              attributes: ['accountId'],
              where: {
                expenseCode: { [Op.in]: expenseLinks.map(({ expenseCode }) => expenseCode) },
              },
              transaction,
            })
          : [];

        this.assertCompatibleAccounts(tenants, accountId);
        this.assertCompatibleAccounts(invoices, accountId);
        this.assertCompatibleAccounts(expenses, accountId);
      }
    }
  }

  private assertCompatibleAccounts(
    records: Array<{ accountId?: number | null }>,
    accountId: number,
  ) {
    if (
      records.some(
        (record) => record.accountId != null && Number(record.accountId) !== accountId,
      )
    ) {
      throw new ConflictException('Resource is linked to another account');
    }
  }
}