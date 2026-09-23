import { Module } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { AuthController } from './auth.controller.js';
import { SequelizeModule } from '@nestjs/sequelize';
import { AccountSchema } from '../common/schema/auth/account.js';
import { RoleSchema } from '../common/schema/auth/role.js';
import { SessionSchema } from '../common/schema/auth/session.js';
import { AuthGuard } from './auth.guard.js';

@Module({
  imports: [SequelizeModule.forFeature([AccountSchema, RoleSchema, SessionSchema])],
  providers: [AuthService, AuthGuard],
  controllers: [AuthController],
  exports: [AuthService]
})
export class AuthModule { }
