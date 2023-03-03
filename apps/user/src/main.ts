import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { EnvService } from '@nhl/env';
import { AppModule } from './app.module';
import { Env } from '@nhl/env/common';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors({ origin: '*' });

  const env = app.get(EnvService<Env>);

  await app.listen(env.get('port'), env.get('host'));
}
bootstrap();
