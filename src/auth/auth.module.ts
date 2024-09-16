import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AppCacheModule } from 'src/cache/cache.module';
import { PrismaService } from 'src/config/prisma.config';

@Module({
  imports: [JwtModule.register({}), AppCacheModule],
  controllers: [AuthController],
  providers: [AuthService, PrismaService],
})
export class AuthModule {}
