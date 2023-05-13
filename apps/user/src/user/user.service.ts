import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '@nhl/schemas/user';
import { UserCreateDto, UserQueryDto } from '~/common/dto/user.dto';
import { DbConnection } from '~/common';
// import { classToPlain } from 'class-transformer';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User, DbConnection.User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(user: UserCreateDto): Promise<User> {
    const newUser = this.userRepository.create(user);
    return await this.userRepository.save(newUser);
  }

  async findOne(user: UserQueryDto): Promise<UserQueryDto> {
    return this.userRepository.findOne({
      where: user,
    }) as unknown as UserQueryDto;
  }

  async findById(id: string): Promise<UserQueryDto> {
    const instance = await this.userRepository.findOne(id);

    return instance;
  }
}
