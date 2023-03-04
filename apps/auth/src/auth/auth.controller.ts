import { Controller, Post } from '@nestjs/common';
import { UserService } from '~/user/user.service';
import { AuthService } from './auth.service';

@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  //   @Post('login')
  //   login() {}

  //   @Post('register')
  //   register() {}
}
