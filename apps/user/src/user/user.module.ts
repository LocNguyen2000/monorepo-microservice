import { Module } from '@nestjs/common';
import { DbConnection } from '~/common';
import { User } from '@nhl/schemas/user';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [TypeOrmModule.forFeature([User], DbConnection.User)],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}
