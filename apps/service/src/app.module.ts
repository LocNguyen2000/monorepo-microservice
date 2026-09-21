import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller.js';
import { EnvModule, EnvService } from '@nhl/env';
import { Env } from './common/env.js';
import { RentProvidersModule } from './rent-providers/rent-providers.module.js';
import { TenantModule } from './tenant/tenant.module.js';
import { SequelizeModule } from '@nestjs/sequelize';
import {
  RentProviderSchema,
  TenantSchema,
  LocationSchema,
  ExpenseLocationSchema,
  TenantLocationSchema,
  InvoiceSchema,
  InvoiceExpenseSchema,
  InvoiceScheduleSchema,
} from './common/schema/user/index.js';
import { LocationsModule } from './locations/locations.module.js';
import { ExpenseSchema } from './common/schema/user/expense.js';
import { ExpenseModule } from './expense/expense.module.js';
import { InvoicesModule } from './invoices/invoices.module.js';
import { AccountSchema } from './common/schema/auth/account.js';
import { RoleSchema } from './common/schema/auth/role.js';
import { OcrModule } from './ocr/ocr.module.js';
import mysql2 from 'mysql2';
import 'dotenv/config';
import { AuthModule } from './auth/auth.module.js';
import { AuthGuard } from './auth/auth.guard.js';
@Module({
  imports: [
    EnvModule.register({ path: '/config/env.json', class: Env }),
    SequelizeModule.forRootAsync({
      inject: [EnvService],
      useFactory: async (env: EnvService<Env>) => {
        const database = env.get('db');
        const { pathname, username, password, hostname, port } = new URL(
          database.sqlUrl,
        );
        console.log('Connecting to database', {
          dialect: 'mysql',
          host: hostname,
          port: +port,
          username: username,
          database: pathname.replace('/', ''),
        });
        console.log('Using ssl', database.ssl?.ca, process.env.SQL_CERT)
        return {
          dialect: 'mysql',
          dialectModule: mysql2,
          host: hostname,
          port: +port,
          username: username,
          database: pathname.replace('/', ''),
          ...(password && { password: password }),
          ...(database.ssl?.ca && {
            dialectOptions: {
              ssl: {
                ca: process.env.SQL_CERT.replace(/\\n/g, '\n'),
              },
            },
          }),
          models: [
            RentProviderSchema,
            TenantSchema,
            LocationSchema,
            ExpenseSchema,
            ExpenseLocationSchema,
            TenantLocationSchema,
            InvoiceSchema,
            InvoiceExpenseSchema,
            InvoiceScheduleSchema,
            // accounts
            AccountSchema,
            RoleSchema
          ],
          logging: false,
          // `sync: { force: true }` DROPS AND RECREATES every table on boot. On
          // serverless that means each cold start wipes the database, so it is now
          // opt-in via DB_SYNC_FORCE and must never be set outside a scratch DB.
          // Without it @nestjs/sequelize still syncs non-destructively.
          ...(process.env.DB_SYNC_FORCE === 'true' && {
            sync: { force: true },
          }),
        };
      },
    }),
    RentProvidersModule,
    TenantModule,
    LocationsModule,
    ExpenseModule,
    InvoicesModule,
    OcrModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [{ provide: APP_GUARD, useClass: AuthGuard }],
})
export class AppModule { }
