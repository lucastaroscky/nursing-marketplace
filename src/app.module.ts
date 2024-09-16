import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';
import { AppCacheModule } from './cache/cache.module';
import { AuthMiddleware } from './common/middlewares/auth.middleware';
import { JwtModule } from '@nestjs/jwt';
import { PrismaService } from './config/prisma.config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    JwtModule.register({}),
    AppCacheModule,
    UserModule,
    AuthModule,
  ],
  providers: [
    PrismaService,
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(
        { path: 'user/:id/ban', method: RequestMethod.ALL },
        { path: 'auth/refresh-token', method: RequestMethod.ALL },
      );
  }
}
