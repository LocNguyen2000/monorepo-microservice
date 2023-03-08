import { NestFactory, HttpAdapterHost } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { EnvService } from '@nhl/env';
import { AppModule } from './app.module';
import { Env } from '@nhl/env/common';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from '@nhl/error/exception.filter';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors({ origin: '*' });

  const env = app.get(EnvService<Env>);

  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
  app.useGlobalFilters(new AllExceptionsFilter(app.get(HttpAdapterHost)));

  await app.listen(env.get('port'), env.get('host'));
}
bootstrap();
