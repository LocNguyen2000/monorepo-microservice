import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { EnvModule, EnvService } from '@nhl/env';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { EmployeeModule } from './employee/employee.module';
import { Env } from '@nhl/env/common';
import { User } from '@nhl/schemas/user';
import { Employee } from '@nhl/schemas/employee';
import { NodeEnv } from '@nhl/env/common/enum';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    EnvModule.register(),
    TypeOrmModule.forRootAsync({
      imports: [EnvModule],
      inject: [EnvService],
      useFactory: (env: EnvService<Env>) => {
        return {
          type: 'mysql',
          url: env.get('db.sqlUrl'),
          synchronize: process.env.NODE_ENV !== NodeEnv.Prod,
          entities: [User, Employee],
        };
      },
    }),
    {
      ...ClientsModule.register([
        {
          name: 'AUTH_SERVICE',
          transport: Transport.KAFKA,
          options: {
            run: { autoCommit: false },
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
    UserModule,
    EmployeeModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
