import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AccountSchema } from '../common/schema/auth/account.js';
import {
  ExpenseLocationSchema,
  ExpenseSchema,
  InvoiceSchema,
  LocationSchema,
  RentProviderSchema,
  TenantLocationSchema,
  TenantSchema,
} from '../common/schema/user/index.js';
import { ResourceAssignmentsController } from './resource-assignments.controller.js';
import { ResourceAssignmentsService } from './resource-assignments.service.js';

@Module({
  imports: [
    SequelizeModule.forFeature([
      AccountSchema,
      TenantSchema,
      LocationSchema,
      InvoiceSchema,
      RentProviderSchema,
      TenantLocationSchema,
      ExpenseLocationSchema,
      ExpenseSchema,
    ]),
  ],
  controllers: [ResourceAssignmentsController],
  providers: [ResourceAssignmentsService],
})
export class ResourceAssignmentsModule {}