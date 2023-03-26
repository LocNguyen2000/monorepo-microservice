import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { EnvService } from '@nhl/env';
import { Env } from '@nhl/env/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({ origin: '*' });

  const env = app.get(EnvService<Env>);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: ['localhost:29092'],
      },
      run: { autoCommit: false },
      producer: {
        idempotent: true,
        allowAutoTopicCreation: true,
      },
      consumer: {
        groupId: 'user-consumer',
        allowAutoTopicCreation: true,
      },
    },
  });

  await app.listen(env.get('port'), env.get('host'));
}
bootstrap();
