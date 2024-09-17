import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { SignInDto } from 'src/auth/dto/sign-in.dto';
import { PrismaService } from 'src/config/prisma.config';

@Injectable()
export class BanCheckGuard implements CanActivate {
  constructor(private prismaService: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.body as SignInDto;

    const userBanned = await this.checkIfUserIsBanned(user.email);

    return userBanned;
  }

  private async checkIfUserIsBanned(userEmail: string) {
    const user = await this.prismaService.user.findUnique({
      where: {
        email: userEmail,
      },
    });

    if (!user || user.isBanned) {
      return false;
    }

    return true;
  }
}
