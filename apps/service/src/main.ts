import { NestFactory, HttpAdapterHost } from '@nestjs/core';
import { EnvService } from '@nhl/env';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from '@nhl/error/exception.filter';
import { Env } from './common/env';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({ origin: '*' });

  const env = app.get(EnvService<Env>);

  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
  app.useGlobalFilters(new AllExceptionsFilter(app.get(HttpAdapterHost)));

  await app.startAllMicroservices();

  await app.listen(env.get('port'), env.get('host'));
}
bootstrap();
