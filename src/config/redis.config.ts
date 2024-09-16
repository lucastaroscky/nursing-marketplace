import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

export type RedisClient = Redis;

export const redisProvider: Provider = {
  provide: 'REDIS_CLIENT',
  useFactory: (configService: ConfigService): RedisClient => {
    const redisUrl = configService.get<string>('REDIS_HOST', 'localhost');
    return new Redis(redisUrl);
  },
  inject: [ConfigService],
};
