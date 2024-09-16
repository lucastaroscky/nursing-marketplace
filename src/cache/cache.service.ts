import { Inject, Injectable } from '@nestjs/common';
import { REDIS_REFRESH_TOKEN_KEY } from './constants/redis-keys.constant';
import { RedisClient } from 'src/config/redis.config';

@Injectable()
export class RedisService {
  constructor(@Inject('REDIS_CLIENT') private redisClient: RedisClient) {}

  async saveSession(userId: string, refreshToken: string) {
    return this.redisClient.set(REDIS_REFRESH_TOKEN_KEY(userId), refreshToken);
  }

  async getSession(userId: string) {
    return this.redisClient.get(REDIS_REFRESH_TOKEN_KEY(userId));
  }

  async removeSession(userId: string) {
    return this.redisClient.del(REDIS_REFRESH_TOKEN_KEY(userId));
  }
}
