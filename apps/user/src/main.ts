import { NestFactory, HttpAdapterHost, NestApplication } from '@nestjs/core';
import { EnvService } from '@nhl/env';
import { AppModule } from './app.module';
import { GlobalEnv } from '@nhl/env';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from '@nhl/error/exception.filter';

async function bootstrap() {
  const app = await NestFactory.create<NestApplication>(AppModule);
  app.enableCors({ origin: '*' });

  const env = app.get(EnvService<GlobalEnv>);

  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
  app.useGlobalFilters(new AllExceptionsFilter(app.get(HttpAdapterHost)));

  await app.startAllMicroservices();

  await app.listen(env.get(''));
}
bootstrap();
