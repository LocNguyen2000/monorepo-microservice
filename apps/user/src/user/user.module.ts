import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DbConnection } from '../common/const';
import { User, UserSchema } from '@nhl/schemas/user';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: User.name, schema: UserSchema }],
      DbConnection.User,
    ),
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
