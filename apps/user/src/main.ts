import { NestFactory, HttpAdapterHost } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { EnvService } from '@nhl/env';
import { AppModule } from './app.module';
import { Env } from '@nhl/env/common';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from '@nhl/error/exception.filter';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors({ origin: '*' });

  const env = app.get(EnvService<Env>);

  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
  app.useGlobalFilters(new AllExceptionsFilter(app.get(HttpAdapterHost)));

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: ['localhost:29092'],
      },
      run: { autoCommit: false },
      subscribe: { fromBeginning: true },
      consumer: {
        groupId: 'user-consumer',
        allowAutoTopicCreation: true,
      },
    },
  });

  await app.startAllMicroservices();

  await app.listen(env.get('port'), env.get('host'));
}
bootstrap();
