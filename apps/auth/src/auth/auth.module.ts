import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '~/user/user.module';
import { Env, EnvModule, EnvService } from '@nhl/env';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthToken } from '@nhl/schemas/auth';
import { DbConnection } from '~/common';
import { JwtModule } from '@nestjs/jwt';
@Module({
  imports: [
    EnvModule,
    JwtModule.registerAsync({
      imports: [EnvModule],
      inject: [EnvService],
      useFactory: (env: EnvService<Env>) => ({
        secret: env.get('auth.signature'),
      }),
    }),
    TypeOrmModule.forFeature([AuthToken], DbConnection.Auth),
    UserModule,
  ],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
