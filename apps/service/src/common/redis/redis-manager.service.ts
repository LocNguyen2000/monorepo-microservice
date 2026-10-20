import {
  Inject,
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import type { RedisClientType, SetOptions } from 'redis';
import {
  cacheLocationIdByAccountKey,
  cacheLocationIdByAccountPattern,
  cacheLocationsByAccountKey,
  cacheLocationsByAccountPattern,
  REDIS_CLIENT,
} from './redis.constants.js';

export const REDIS_WRITE_EVENT = 'redis.write';
export type RedisWriteEvent = {
  keys: string[];
  payload?: any;
};

@Injectable()
export class RedisManagerService implements OnModuleInit, OnModuleDestroy {
  constructor(
    @Inject(REDIS_CLIENT) readonly redis: RedisClientType,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.redis.connect();
  }

  async onModuleDestroy(): Promise<void> {
    if (this.redis.isOpen) {
      await this.redis.quit();
    }
  }

  async getCacheLocationsByAccount(
    accountId: number,
    page?: number,
    size?: number,
  ): Promise<any | null> {
    const cacheKey = cacheLocationsByAccountKey(accountId, page, size);
    Logger.log(`Fetching cached locations from key: ${cacheKey}`);
    const cachedData = await this.redis.get(cacheKey);
    return typeof cachedData === 'string' ? JSON.parse(cachedData) : null;
  }

  async getCacheLocationByAccount(
    accountId: number,
    locationId: number,
  ): Promise<any | null> {
    const cacheKey = cacheLocationIdByAccountKey(accountId, locationId);
    Logger.log(`Fetching cached location from key: ${cacheKey}`);
    const cachedData = await this.redis.get(cacheKey);
    return typeof cachedData === 'string' ? JSON.parse(cachedData) : null;
  }

  async invalidateLocationCaches(accountIds: number[]): Promise<void> {
    const patterns = [...new Set(accountIds)].flatMap((accountId) => [
      cacheLocationsByAccountPattern(accountId),
      cacheLocationIdByAccountPattern(accountId),
    ]);
    await Promise.all(patterns.map((pattern) => this.deleteByPattern(pattern)));
  }

  @OnEvent(REDIS_WRITE_EVENT)
  handleRedisWriteEvent(event: RedisWriteEvent) {
    Logger.log(
      `Redis write operation: keys: ${event.keys.join(', ')}`,
    );

    if (event.keys.length > 0 && event.payload !== undefined) {
      let payload = event.payload ? JSON.stringify(event.payload) : '';

      this.set(event.keys[0], payload, { EX: 3600 }).catch((err) => {
        Logger.error('Error setting Redis key:', err);
      });
    }
  }

  private async set(
    key: string,
    value: string,
    options?: SetOptions,
  ) {
    const result = await this.redis.set(key, value, options);
    return result;
  }

  private async deleteByPattern(pattern: string): Promise<void> {
    for await (const keys of this.redis.scanIterator({
      MATCH: pattern,
      COUNT: 100,
    })) {
      if (keys.length > 0) {
        await this.redis.del(keys);
      }
    }
  }
}
