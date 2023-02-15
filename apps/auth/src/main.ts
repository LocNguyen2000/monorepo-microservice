import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Env } from './common/interfaces/env';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({ origin: '*' });

  const config = app.get(ConfigService<Env>);

  await app.listen(config.get('PORT'), config.get('HOST'));
}
bootstrap();
