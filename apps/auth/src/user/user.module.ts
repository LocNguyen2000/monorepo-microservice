import { Module } from '@nestjs/common';
import { DbConnection } from '~/common';
import { User } from '@nhl/schemas/user';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';

@Module({
  imports: [TypeOrmModule.forFeature([User], DbConnection.User)],
  providers: [UserService],
})
export class UserModule {}
