import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { UserCreateDto, UserSignInDto } from '~/common/dto/user.dto';
import { UserService } from '~/user/user.service';
import * as bcrypt from 'bcrypt';
import { ClientKafka } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
@Injectable()
export class AuthService implements OnModuleInit {
  constructor(
    private userService: UserService,
    @Inject('AUTH_SERVICE') private readonly clientKafka: ClientKafka,
  ) {}
  onModuleInit() {
    this.clientKafka.subscribeToResponseOf('USER_CREATE');
  }

  async validateUser(user: UserSignInDto): Promise<any> {
    const profile = await this.userService.findOne({
      username: user.username,
    });
    if (profile && profile.password === user.password) {
      return user;
    }
    return null;
  }

  async register(user: UserCreateDto) {
    const response = await lastValueFrom(
      this.clientKafka.send('USER_CREATE', user),
    );

    console.log('[RETURNED]', response);

    if (response) return { message: 'Create user successfully' };

    return { message: 'Create user fail' };
  }
}
