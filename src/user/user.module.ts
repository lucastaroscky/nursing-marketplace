import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PrismaService } from 'src/config/prisma.config';
import { AppCacheModule } from 'src/cache/cache.module';

@Module({
  imports: [AppCacheModule],
  controllers: [UserController],
  providers: [UserService, PrismaService],
})
export class UserModule {}
