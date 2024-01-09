import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { EnvService } from '@nhl/env';
import { Env } from './common/env';
import { AllExceptionsFilter } from '@nhl/error/exception.filter';

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
