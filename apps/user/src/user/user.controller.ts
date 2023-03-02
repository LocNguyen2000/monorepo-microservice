import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { User } from '@nhl/schemas/user';
import { UserCreateDto, UserQueryDto } from '~/common/dto/user.dto';
import { UserService } from './user.service';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/filter')
  async findOne(@Param() params: UserQueryDto): Promise<User> {
    return await this.userService.findOne(params);
  }

  @Post()
  async create(@Body() payload: UserCreateDto) {
    return await this.userService.create(payload);
  }
}
