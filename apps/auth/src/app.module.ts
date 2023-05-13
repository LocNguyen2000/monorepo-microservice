import { Module, ValidationPipe } from '@nestjs/common';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { EnvModule, EnvService } from '@nhl/env';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Env } from '@nhl/env/common';
import { NodeEnv } from '@nhl/env/common/enum';
import { AuthToken } from '@nhl/schemas/auth';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { DbConnection } from './common';
import { User } from '@nhl/schemas/user';
import { APP_PIPE } from '@nestjs/core';

@Module({
  imports: [
    EnvModule.register(),
    TypeOrmModule.forRootAsync({
      imports: [EnvModule],
      inject: [EnvService],
      name: DbConnection.Auth,
      useFactory: (env: EnvService<Env>) => ({
        type: 'mysql',
        url: env.get('db.auth.sqlUrl'),
        synchronize: process.env.NODE_ENV !== NodeEnv.Prod,
        entities: [AuthToken],
      }),
    }),
    TypeOrmModule.forRootAsync({
      imports: [EnvModule],
      inject: [EnvService],
      name: DbConnection.User,
      useFactory: (env: EnvService<Env>) => ({
        type: 'mysql',
        url: env.get('db.user.sqlUrl'),
        synchronize: process.env.NODE_ENV !== NodeEnv.Prod,
        entities: [User],
      }),
    }),
    {
      ...ClientsModule.register([
        {
          name: 'AUTH_SERVICE',
          transport: Transport.KAFKA,
          options: {
            client: {
              clientId: 'user',
              brokers: ['localhost:29092'],
            },
            producer: {
              idempotent: true,
              allowAutoTopicCreation: true,
            },
            consumer: {
              groupId: 'user-consumer',
            },
          },
        },
      ]),
      global: true,
    },
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
  ],
})
export class AppModule {}
