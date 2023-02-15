import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UserDocument } from '@nhl/schemas/user';
import { UserCreateDto, UserQueryDto } from '../common/interfaces/user';
import { UserService } from './user.service';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/filter')
  async findOne(@Param() params: UserQueryDto): Promise<UserDocument> {
    return await this.userService.findOne(params);
  }

  @Post()
  async create(@Body() user: UserCreateDto) {
    return await this.userService.create(user);
  }
}
