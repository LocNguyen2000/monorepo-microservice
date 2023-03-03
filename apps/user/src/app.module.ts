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
    UserModule,
    EmployeeModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
