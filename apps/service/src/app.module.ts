import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { EnvModule, EnvService } from '@nhl/env';
import { Env } from './common/env';
import { RentProvidersModule } from './rent-providers/rent-providers.module';
import { TenantModule } from './tenant/tenant.module';
import { SequelizeModule, SequelizeModuleOptions } from '@nestjs/sequelize';
import {
  RentProviderSchema,
  TenantSchema,
  LocationSchema,
  ExpenseLocationSchema,
} from '@nhl/schemas/user';
import { LocationsModule } from './locations/locations.module';
import { ExpenseSchema } from '@nhl/schemas/user/expense';
import { ExpenseModule } from './expense/expense.module';
import { InvoicesModule } from './invoices/invoices.module';
import { OpenAiModule } from './openai/openai.module';
import { SocketModule } from './socket/socket.module';

@Module({
  imports: [
    EnvModule.register({ path: '/config/env.json', class: Env }),
    SequelizeModule.forRootAsync({
      inject: [EnvService],
      useFactory: async (env: EnvService<Env>) => {
        const { pathname, username, hostname, password, port } = new URL(
          env.get('db.sqlUrl'),
        );
        const cert = env.get('db.ssl');
        const defaultConfig: SequelizeModuleOptions = {
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
          ],
          retryAttempts: 10,
          logging: false,
          sync: {
            force: false,
          },
        };

        if (password) defaultConfig['password'] = password;
        if (cert) {
          defaultConfig['ssl'] = true;
          defaultConfig['dialectOptions'] = {
            ssl: {
              ca: cert,
              rejectUnauthorized: true,
            },
          };
        }
        return defaultConfig;
      },
    }),
    RentProvidersModule,
    TenantModule,
    LocationsModule,
    ExpenseModule,
    InvoicesModule,
    OpenAiModule,
    SocketModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
