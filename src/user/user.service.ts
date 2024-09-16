import { Injectable } from '@nestjs/common';
import { RedisService } from 'src/cache/cache.service';
import { PrismaService } from 'src/config/prisma.config';

@Injectable()
export class UserService {
  constructor(
    private readonly prismaService: PrismaService,
    private redisService: RedisService,
  ) {}

  private setBanUser(userId: string) {
    return this.prismaService.user.update({
      where: {
        id: userId,
      },
      data: {
        isBanned: true,
      },
    });
  }

  async banUser(userId: string) {
    await this.setBanUser(userId);
    await this.redisService.removeSession(userId);
  }
}
