import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { EnvModule, EnvService } from '@nhl/env';
import { Env } from './common/env';
import { RentProvidersModule } from './rent-providers/rent-providers.module';
import { TenantModule } from './tenant/tenant.module';
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
} from './common/schema/user';
import { LocationsModule } from './locations/locations.module';
import { ExpenseSchema } from './common/schema/user/expense';
import { ExpenseModule } from './expense/expense.module';
import { InvoicesModule } from './invoices/invoices.module';
import { OcrModule } from './ocr/ocr.module';
import { SocketModule } from './socket/socket.module';

@Module({
  imports: [
    EnvModule.register({ path: '/config/env.json', class: Env }),
    SequelizeModule.forRootAsync({
      inject: [EnvService],
      useFactory: async (env: EnvService<Env>) => {
        const { pathname, username, hostname, port } = new URL(
          env.get('db.sqlUrl'),
        );
        console.log('Connecting to database', {
          dialect: 'mysql',
          host: hostname,
          port: +port,
          username: username,
          database: pathname.replace('/', ''),
        });
        return {
          dialect: 'mysql',
          host: hostname,
          port: +port,
          username: username,
          database: pathname.replace('/', ''),
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
          ],
          logging: false,
          sync: {
            force: true,
          },
        };
      },
    }),
    RentProvidersModule,
    TenantModule,
    LocationsModule,
    ExpenseModule,
    InvoicesModule,
    OcrModule,
    SocketModule,
  ],
  controllers: [AppController],
})
export class AppModule { }
