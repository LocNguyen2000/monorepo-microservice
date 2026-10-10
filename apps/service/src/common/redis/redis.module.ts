import { Global, Logger, Module } from '@nestjs/common';
import { EnvService } from '@nhl/env';
import { createClient } from 'redis';
import { Env } from '../env.js';
import { REDIS_CLIENT } from './redis.constants.js';
import { RedisManagerService } from './redis-manager.service.js';

@Global()
@Module({
  providers: [
    {
      provide: REDIS_CLIENT,
      inject: [EnvService],
      useFactory: (env: EnvService<Env>) => {
        const client = createClient({ url: env.get('cache.url') });
        client.on('error', (error) =>
          Logger.error(error.message, error.stack, 'RedisModule'),
        );
        return client;
      },
    },
    RedisManagerService,
  ],
  exports: [REDIS_CLIENT, RedisManagerService],
})
export class RedisModule {}
