import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { LoginDto, RegisterDto } from './auth.dto.js';
import { Public } from './auth.decorator.js';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Public()
    @Post('register')
    register(@Body() input: RegisterDto) {
        return this.authService.register(input);
    }

    @Public()
    @Post('login')
    login(@Body() input: LoginDto) {
        return this.authService.login(input);
    }
}
