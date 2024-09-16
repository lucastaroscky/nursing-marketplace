import { Module } from '@nestjs/common';
import { CacheService } from './cache.service';
import { ConfigModule } from '@nestjs/config';
import { redisProvider } from 'src/config/redis.config';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true })],
  providers: [redisProvider, CacheService],
  exports: [CacheService],
})
export class AppCacheModule {}
