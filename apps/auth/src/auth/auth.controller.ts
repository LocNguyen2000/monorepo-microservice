import { Body, Controller, Post } from '@nestjs/common';
import { UserCreateDto, UserSignInDto } from '~/common/dto/user.dto';
import { AuthService } from './auth.service';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('login')
  login(@Body() user: UserSignInDto) {
    return this.authService.validateUser(user);
  }

  @Post('register')
  register(@Body() user: UserCreateDto) {
    return this.authService.register(user);
  }
}
