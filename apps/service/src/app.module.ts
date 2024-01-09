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
} from '@nhl/schemas/user';
import { LocationsModule } from './locations/locations.module';

@Module({
  imports: [
    EnvModule.register({ path: '/config/env.json', class: Env }),
    SequelizeModule.forRootAsync({
      inject: [EnvService],
      useFactory: async (env: EnvService<Env>) => {
        const { pathname, username, hostname, port } = new URL(
          env.get('db.sqlUrl'),
        );
        return {
          dialect: 'mysql',
          host: hostname,
          port: +port,
          username: username,
          database: pathname.replace('/', ''),
          models: [RentProviderSchema, TenantSchema, LocationSchema],
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
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
