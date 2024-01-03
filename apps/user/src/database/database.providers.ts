import { Sequelize } from 'sequelize-typescript';
import {
  UserSchema,
  RoleSchema,
  RentProviderSchema,
  TenantSchema,
} from '@nhl/schemas/user';
import { Provider } from '@nestjs/common';
import { EnvService } from '@nhl/env';
import { Env } from '~/common/env';
export const databaseProviders: Provider[] = [
  {
    provide: 'SEQUELIZE',
    inject: [EnvService],
    useFactory: async (env: EnvService<Env>) => {
      const { pathname, username, hostname, port } = new URL(
        env.get('db.user.sqlUrl'),
      );

      const sequelize = new Sequelize({
        dialect: 'mysql',
        host: hostname,
        port: Number(port),
        username: username,
        database: pathname.replace('/', ''),
      });
      sequelize.addModels([
        RoleSchema,
        UserSchema,
        RentProviderSchema,
        TenantSchema,
      ]);
      await sequelize.sync();
      return sequelize;
    },
  },
];
