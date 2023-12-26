import { Module, ValidationPipe } from '@nestjs/common';
import { AppController } from './app.controller';
import { EnvModule } from '@nhl/env';
import { APP_PIPE } from '@nestjs/core';

@Module({
  imports: [EnvModule.register()],
  controllers: [AppController],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
  ],
})
export class AppModule {}
