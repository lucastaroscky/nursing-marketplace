import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { User } from 'src/common/decorators/user.decorator';
import { AuthUser } from 'src/common/interfaces/auth-user.interface';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('sign-up')
  async signUp(@Body() body: SignUpDto) {
    return this.authService.signUp(body);
  }

  @Post('sign-in')
  async signIn(@Body() body: SignInDto) {
    return this.authService.signIn(body);
  }

  @Post('sign-out')
  async signOut(@User() { userId }: AuthUser) {
    return this.authService.signOut(userId);
  }

  @Post('refresh-token')
  async refreshToken(@User() { userId }: AuthUser) {
    return this.authService.revokeToken(userId);
  }
}
