import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { DbConnection } from './common/const';
import { EnvModule, EnvService } from '@nhl/env';
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
    AuthModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
