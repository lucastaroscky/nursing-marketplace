import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { RedisService } from 'src/cache/cache.service';
import { INVALID_OR_EXPIRED_TOKEN } from '../constants/error-messages.constant';

@Injectable()
export class SessionCheckGuard implements CanActivate {
  constructor(private redisService: RedisService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const user = request.user;

    const isUserSessionValid = await this.checkIfSessionIsValid(user);

    if (!isUserSessionValid) {
      throw new UnauthorizedException(INVALID_OR_EXPIRED_TOKEN);
    }

    return true;
  }

  private async checkIfSessionIsValid(userId: string) {
    const isTokenValid = await this.redisService.getSession(userId);

    return isTokenValid;
  }
}
