import { Module } from '@nestjs/common';
import { AuthCodeService } from './auth-code.service';
import { ClientService } from './client.service';
import { OAuthService } from './oauth.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthCodeSchema, ClientSchema } from '../common/schema/account';

@Module({
  imports: [SequelizeModule.forFeature([ClientSchema, AuthCodeSchema])],
  providers: [AuthCodeService, ClientService, OAuthService],
  exports: [AuthCodeService, ClientService, OAuthService],
})
export class AuthModule {}
