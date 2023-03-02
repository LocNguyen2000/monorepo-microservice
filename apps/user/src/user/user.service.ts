import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '@nhl/schemas/user';
import { DbConnection } from '~/common';
import { UserCreateDto, UserQueryDto } from '~/common/dto/user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User, DbConnection.User)
    private readonly userRepo: Repository<User>,
  ) {}

  async create(user: UserCreateDto): Promise<User> {
    return this.userRepo.create(user);
  }

  async findOne(user: UserQueryDto): Promise<User> {
    return this.userRepo.findOneBy(user);
  }
}