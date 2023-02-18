import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { UserModule } from './user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { DbConnection } from './common/const';
import { EnvModule, EnvService } from '@nhl/env';
import { EmployeeModule } from './employee/employee.module';
@Module({
  imports: [
    EnvModule.register(),
    MongooseModule.forRootAsync({
      connectionName: DbConnection.User,
      imports: [EnvModule],
      inject: [EnvService],
      useFactory: (env: EnvService) => ({
        uri: env.get('mongoUrl'),
      }),
    }),
    UserModule,
    EmployeeModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
