import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { User } from '@nhl/schemas/user';
import { UserCreateDto, UserQueryDto } from '~/common/dto/user.dto';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // TODO: Testing kafka message pattern
  // @MessagePattern('USER_CREATE')
  // async createUserFromAuth(@Payload() payload: any) {
  //   console.log('[RECEIVED]', payload);
  //   const response = await this.userService.create(payload);
  //   console.log('[RESPONSE]', response);
  //   return JSON.stringify(response);
  // }

  @Get('/:id')
  async findById(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<UserQueryDto> {
    const instance = await this.userService.findById(id);

    return instance;
  }

  @Post()
  async create(@Body() payload: UserCreateDto) {
    return await this.userService.create(payload);
  }
}
