import { Module } from '@nestjs/common';
import { User } from '@nhl/schemas/user';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { DbConnection } from '~/common';

@Module({
  imports: [TypeOrmModule.forFeature([User], DbConnection.User)],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserModule],
})
export class UserModule {}
