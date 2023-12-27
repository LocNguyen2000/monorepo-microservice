import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { EnvModule } from '@nhl/env';
import { Env } from './common/env';

@Module({
  imports: [EnvModule.register({ path: '/config/env.json', class: Env })],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
