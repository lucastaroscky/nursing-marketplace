import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request, Response, NextFunction } from 'express';
import { AuthUser } from '../interfaces/auth-user.interface';
import { PrismaService } from 'src/config/prisma.config';
import {
  BANNED_USER,
  INVALID_OR_EXPIRED_TOKEN,
  TOKEN_NOT_FOUND,
} from '../constants/error-messages.constant';
import { CacheService } from 'src/cache/cache.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private prismaSerive: PrismaService,
    private cacheManager: CacheService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1];

    if (!token) {
      throw new UnauthorizedException(TOKEN_NOT_FOUND);
    }

    const secret = this.configService.get('JWT_SECRET');

    const isTokenValid = this.jwtService.verify(token, secret);
    const decodedToken = this.jwtService.decode<AuthUser>(token, secret);

    const isSessionValid = await this.checkIfSessionIsValid(
      decodedToken.userId,
    );

    if (!isTokenValid || !isSessionValid) {
      throw new UnauthorizedException(INVALID_OR_EXPIRED_TOKEN);
    }

    const isUserBanned = await this.checkIfUserIsBanned(decodedToken.userId);

    if (isUserBanned) {
      throw new UnauthorizedException(BANNED_USER);
    }

    next();
  }

  private async checkIfUserIsBanned(userId: string) {
    const user = await this.prismaSerive.user.findUnique({
      where: {
        id: userId,
      },
    });

    return user.isBanned;
  }

  private async checkIfSessionIsValid(userId: string) {
    const isTokenValid = await this.cacheManager.getSession(userId);

    return isTokenValid;
  }
}
