import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request, Response, NextFunction } from 'express';
import { TOKEN_NOT_FOUND } from '../constants/messages.constant';
import { AuthUser } from '../interfaces/auth-user.interface';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1];

    if (!token) {
      throw new UnauthorizedException(TOKEN_NOT_FOUND);
    }

    const secret = this.configService.get('JWT_SECRET');
    const { sub: userId } = this.jwtService.verify<AuthUser>(token, { secret });

    req['user'] = userId;

    next();
  }
}
