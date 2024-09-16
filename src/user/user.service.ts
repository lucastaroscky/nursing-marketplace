import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/config/prisma.config';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  async banUser(userId: string) {
    await this.prismaService.user.update({
      where: {
        id: userId,
      },
      data: {
        isBanned: true,
      },
    });
  }
}
