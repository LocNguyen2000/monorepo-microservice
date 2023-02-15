import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DbConnection } from '~/common/const';
import { UserService } from './user.service';
import { User, UserSchema } from '@nhl/schemas';

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: User.name, schema: UserSchema }],
      DbConnection.User,
    ),
  ],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
