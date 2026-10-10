import {
  Inject,
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import type { RedisClientType, SetOptions } from 'redis';
import {
  cacheLocationIdByAccountKey,
  cacheLocationsByAccountKey,
  REDIS_CLIENT,
} from './redis.constants.js';

export const REDIS_WRITE_EVENT = 'redis.write';
export const REDIS_DELETE_EVENT = 'redis.delete';
export type RedisWriteEvent = {
  keys: string[];
  payload?: any;
};

export type RedisDeleteEvent = {
  keys?: string[];
  patterns?: string[];
};


@Injectable()
export class RedisManagerService implements OnModuleInit, OnModuleDestroy {
  constructor(
    @Inject(REDIS_CLIENT) readonly redis: RedisClientType,
    private readonly eventEmitter: EventEmitter2,
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

  @OnEvent(REDIS_DELETE_EVENT)
  handleRedisDeleteEvent(event: RedisDeleteEvent) {
    const deletes = [
      ...(event.keys?.length
        ? [this.delete(...event.keys)]
        : []),
      ...(event.patterns?.length
        ? event.patterns.map((pattern) => this.deleteByPattern(pattern))
        : []),
    ];

    Promise.all(deletes).catch((error: unknown) => {
      Logger.error(
        'Error deleting Redis cache keys',
        error instanceof Error ? error.stack : String(error),
        RedisManagerService.name,
      );
    });
  }

  private async set(
    key: string,
    value: string,
    options?: SetOptions,
  ) {
    const result = await this.redis.set(key, value, options);
    return result;
  }

  private async delete(...keys: string[]): Promise<number> {
    if (keys.length === 0) {
      throw new Error('At least one Redis key is required');
    }

    const result = await this.redis.del(keys);
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
