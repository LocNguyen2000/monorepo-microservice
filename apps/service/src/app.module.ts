import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { EnvModule, EnvService } from '@nhl/env';
import { Env } from './common/env';
import { RentProvidersModule } from './rent-providers/rent-providers.module';
import { UsersModule } from './users/users.module';
import { TenantModule } from './tenant/tenant.module';
import { SequelizeModule } from '@nestjs/sequelize';
import {
  RoleSchema,
  UserSchema,
  RentProviderSchema,
  TenantSchema,
  LocationSchema,
} from '@nhl/schemas/user';

@Module({
  imports: [
    EnvModule.register({ path: '/config/env.json', class: Env }),
    SequelizeModule.forRootAsync({
      inject: [EnvService],
      useFactory: async (env: EnvService<Env>) => {
        const { pathname, username, hostname, port } = new URL(
          env.get('db.user.sqlUrl'),
        );
        return {
          dialect: 'mysql',
          host: hostname,
          port: +port,
          username: username,
          database: pathname.replace('/', ''),
          models: [
            RoleSchema,
            UserSchema,
            RentProviderSchema,
            TenantSchema,
            LocationSchema,
          ],
          sync: {
            force: true,
          },
        };
      },
    }),
    RentProvidersModule,
    UsersModule,
    TenantModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
