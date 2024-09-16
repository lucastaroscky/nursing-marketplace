import { Module } from '@nestjs/common';
import { RedisService } from './cache.service';
import { ConfigModule } from '@nestjs/config';
import { redisProvider } from 'src/config/redis.config';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true })],
  providers: [redisProvider, RedisService],
  exports: [RedisService],
})
export class AppCacheModule {}
