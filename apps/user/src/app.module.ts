import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { EnvModule, EnvService } from '@nhl/env';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DbConnection } from './common';
import { UserModule } from './user/user.module';
import { EmployeeModule } from './employee/employee.module';
import { Env } from '@nhl/env/common';
@Module({
  imports: [
    EnvModule.register(),
    TypeOrmModule.forRootAsync({
      name: DbConnection.User,
      imports: [EnvModule],
      inject: [EnvService],
      useFactory: (env: EnvService<Env>) => {
        return {
          url: env.get('db.sqlUrl'),
          type: 'mysql',
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
