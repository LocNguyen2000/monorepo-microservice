import { NestFactory } from '@nestjs/core';
import { EnvService } from '@nhl/env';
import { Env } from '@nhl/env/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({ origin: '*' });

  const env = app.get(EnvService<Env>);

  await app.listen(env.get('port'), env.get('host'));
}
bootstrap();
