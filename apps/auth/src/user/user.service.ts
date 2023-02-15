import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '@nhl/schemas';
import { Model } from 'mongoose';
import { DbConnection } from '~/common/const';
import { UserCreateDto, UserQueryDto } from '~/common/interfaces/user';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name, DbConnection.User)
    private userModel: Model<UserDocument>,
  ) {}

  async create(user: UserCreateDto): Promise<User> {
    const response = new this.userModel(user).save();
    return response;
  }

  async findOne(user: UserQueryDto): Promise<User> {
    const response = await this.userModel.findOne(user).exec();
    return response;
  }
}
