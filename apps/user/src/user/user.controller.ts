import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { User } from '@nhl/schemas/user';
import { UserCreateDto, UserQueryDto } from '~/common/dto/user.dto';
import { UserService } from './user.service';

@Controller('Users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern('USER_CREATE')
  async createUserFromAuth(@Payload() payload: any) {
    console.log('[RECEIVED]', payload);

    const response = await this.userService.create(payload);

    return response;
  }

  @Get('/filter')
  async findOne(@Param() params: UserQueryDto): Promise<User> {
    return await this.userService.findOne(params);
  }

  @Get('/:id')
  async findById(@Param('id') id: number): Promise<User> {
    return await this.userService.findById(id);
  }

  @Post()
  async create(@Body() payload: UserCreateDto) {
    return await this.userService.create(payload);
  }
}
