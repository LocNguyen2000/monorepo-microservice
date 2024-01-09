import { NestFactory, HttpAdapterHost } from '@nestjs/core';
import { EnvService } from '@nhl/env';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from '@nhl/error/exception.filter';
import { LoggingInterceptor } from '@nhl/error/interceptor';
import { Env } from './common/env';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
    logger: ['error', 'warn', "log"],
  });
  app.enableCors({ origin: '*' });

  const env = app.get(EnvService<Env>);
  const logger = new Logger();

  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
  app.useGlobalFilters(new AllExceptionsFilter(app.get(HttpAdapterHost)));
  app.useGlobalInterceptors(new LoggingInterceptor(logger))

  await app.startAllMicroservices();

  await app.listen(env.get('port'), env.get('host'));
}
bootstrap();
