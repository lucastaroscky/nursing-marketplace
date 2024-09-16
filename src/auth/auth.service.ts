import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SignInDto } from './dto/sign-in.dto';
import { ConfigService } from '@nestjs/config';
import { SignUpDto } from './dto/sign-up.dto';
import { PrismaService } from 'src/config/prisma.config';
import { RedisService } from 'src/cache/cache.service';
import { hash, verify } from 'argon2';
import {
  INCORRECT_EMAIL_PASSWORD,
  USER_NOT_FOUND,
} from 'src/common/constants/messages.constant';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private redisService: RedisService,
  ) {}

  private async generateToken(userId: string) {
    const payload = { sub: userId };
    const secret = this.configService.get('JWT_SECRET');

    const token = await this.jwtService.signAsync(payload, {
      expiresIn: '15m',
      secret,
    });

    return token;
  }

  private async generateRefreshToken(userId: string) {
    const payload = { sub: userId };
    const secret = this.configService.get('JWT_SECRET');

    const token = await this.jwtService.signAsync(payload, {
      expiresIn: '7d',
      secret,
    });

    return token;
  }

  async signUp(signUp: SignUpDto) {
    const hashedPassword = await hash(signUp.password);

    const user = await this.prismaService.user.create({
      data: {
        name: signUp.name,
        email: signUp.email,
        password: hashedPassword,
      },
    });

    const accessToken = await this.generateToken(user.id);
    const refreshToken = await this.generateRefreshToken(user.id);
    await this.redisService.saveSession(user.id, refreshToken);

    return {
      id: user.id,
      email: user.email,
      accessToken,
      refreshToken,
    };
  }

  async signIn(loginDto: SignInDto) {
    const user = await this.prismaService.user.findUnique({
      where: {
        email: loginDto.email,
      },
    });

    if (!user) {
      throw new BadRequestException(INCORRECT_EMAIL_PASSWORD);
    }

    const isUserPasswordValid = await verify(user.password, loginDto.password);

    if (!isUserPasswordValid) {
      throw new BadRequestException(INCORRECT_EMAIL_PASSWORD);
    }

    const accessToken = await this.generateToken(user.id);
    const refreshToken = await this.generateRefreshToken(user.id);
    await this.redisService.saveSession(user.id, refreshToken);

    return { accessToken, refreshToken };
  }

  async signOut(userId: string) {
    return this.redisService.removeSession(userId);
  }

  async revokeToken(userId: string) {
    const user = this.prismaService.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException(USER_NOT_FOUND);
    }

    return this.redisService.removeSession(userId);
  }

  async refreshSession(userId: string) {
    const accessToken = await this.generateToken(userId);

    return { accessToken };
  }
}
