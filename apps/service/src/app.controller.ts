import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getHello(): string {
    return 'hello';
  }

  @Get('ping')
  healthcheck(): string {
    return 'pong';
  }
}
