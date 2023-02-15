import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { Env } from './common/interfaces/env';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const config = app.get(ConfigService<Env>);

  app.enableCors({ origin: '*' });

  await app.listen(config.get('PORT'), config.get('HOST'));
}
bootstrap();
