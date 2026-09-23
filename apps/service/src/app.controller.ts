import { Controller, Get } from '@nestjs/common';
import { Public } from './auth/auth.decorator.js';

@Controller()
export class AppController {
  @Public()
  @Get()
  getHello(): string {
    return 'hello';
  }
}
