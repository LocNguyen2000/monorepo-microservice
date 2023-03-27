import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { EnvModule, EnvService } from '@nhl/env';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Env } from '@nhl/env/common';
import { NodeEnv } from '@nhl/env/common/enum';
import { User } from '@nhl/schemas/user';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    EnvModule.register(),
    TypeOrmModule.forRootAsync({
      imports: [EnvModule],
      inject: [EnvService],
      useFactory: (env: EnvService<Env>) => ({
        type: 'mysql',
        url: env.get('db.sqlUrl'),
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
  providers: [],
})
export class AppModule {}
