import { NestFactory } from '@nestjs/core';
import { EnvService } from '@nhl/env';
import { AppModule } from './app.module';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({ origin: '*' });

  const env = app.get(EnvService);

  await app.listen(env.get('port'), env.get('host'));
}
bootstrap();
