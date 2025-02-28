import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EnvModule, EnvService } from '@nhl/env';
import { RoleSchema, AccountSchema } from '@nhl/schemas/user';
import { AuthCodeSchema, ClientSchema } from '@nhl/schemas/account';
import { Env } from './common/env';
import { SequelizeModule, SequelizeModuleOptions } from '@nestjs/sequelize';
import { AuthModule } from './auth/auth.module';
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
          models: [AccountSchema, RoleSchema, AuthCodeSchema, ClientSchema],
          sync: {
            force: false,
          },
          retryAttempts: 10,
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

    SequelizeModule.forFeature([AccountSchema, RoleSchema]),
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
