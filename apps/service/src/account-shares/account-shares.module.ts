import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AccountSchema } from '../common/schema/auth/account.js';
import { AccountShareSchema } from '../common/schema/auth/account-share.js';
import { AccountSharesController } from './account-shares.controller.js';
import { AccountSharesService } from './account-shares.service.js';

@Module({
  imports: [SequelizeModule.forFeature([AccountSchema, AccountShareSchema])],
  controllers: [AccountSharesController],
  providers: [AccountSharesService],
  exports: [AccountSharesService],
})
export class AccountSharesModule {}