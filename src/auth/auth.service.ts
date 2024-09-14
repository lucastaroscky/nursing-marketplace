import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compareHash, encryptPassword } from 'src/utils/bcrypt';
import { SignInDto } from './dto/sign-in.dto';
import { ConfigService } from '@nestjs/config';
import { SignUpDto } from './dto/sign-up.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async signUp(signUp: SignUpDto) {
    const hashedPassword = await encryptPassword(signUp.password);

    const user = await this.prismaService.user.create({
      data: {
        name: signUp.name,
        email: signUp.email,
        password: hashedPassword,
      },
    });

    const accessToken = await this.generateToken(user.id, user.email);

    return {
      id: user.id,
      email: user.email,
      accessToken,
    };
  }

  async signIn(loginDto: SignInDto) {
    const user = await this.prismaService.user.findUnique({
      where: {
        email: loginDto.email,
      },
    });

    if (!user) {
      throw new BadRequestException('email or password incorrect');
    }

    const isUserPasswordValid = await compareHash(
      user.password,
      loginDto.password,
    );

    if (!user || !isUserPasswordValid) {
      throw new BadRequestException('email or password incorrect');
    }

    if (user && isUserPasswordValid) {
      const accessToken = await this.generateToken(user.id, user.email);

      return { accessToken };
    }
  }

  private async generateToken(userId: string, email: string) {
    const payload = { sub: userId, email };
    const secret = this.configService.get('JWT_SECRET');

    const token = await this.jwtService.signAsync(payload, {
      expiresIn: '20m',
      secret,
    });

    return token;
  }

  async generateRefreshToken(userId: string) {
    const payload = { sub: userId };
    const secret = this.configService.get('JWT_SECRET');

    const token = await this.jwtService.signAsync(payload, {
      expiresIn: '7d',
      secret,
    });

    return token;
  }

  // async validateRefreshToken(refreshToken, userId) {
  //   const user = await this.userService.findUserById(userId);

  //   const isTokenValid = await compareHash(refreshToken, user.refreshToken);

  //   return isTokenValid;
  // }
}
