import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { User } from '@nhl/schemas/user';
import { UserCreateDto, UserQueryDto } from '~/common/dto/user.dto';
import { UserService } from './user.service';

@UsePipes(new ValidationPipe({ transform: true }))
@Controller('Users')
export class UserController {
  constructor(private readonly userService: UserService) {}

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
