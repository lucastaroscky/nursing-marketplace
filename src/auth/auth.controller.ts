import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { User } from 'src/common/decorators/user.decorator';
import { BanCheckGuard } from 'src/common/guards/ban-check.guard';
import { SessionCheckGuard } from 'src/common/guards/session-check.guard';
import {
  REVOKED_ACCESS,
  USER_SINGOUT,
} from 'src/common/constants/messages.constant';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('sign-up')
  async signUp(@Body() body: SignUpDto) {
    return this.authService.signUp(body);
  }

  @Post('sign-in')
  @UseGuards(BanCheckGuard)
  async signIn(@Body() body: SignInDto) {
    return this.authService.signIn(body);
  }

  @Post('sign-out')
  @HttpCode(HttpStatus.OK)
  async signOut(@User() userId: string) {
    await this.authService.signOut(userId);
    return { message: USER_SINGOUT };
  }

  @Post('revoke-access/:id')
  @UseGuards(SessionCheckGuard)
  @HttpCode(HttpStatus.OK)
  async revokeAccess(@Param() { id }: { id: string }) {
    await this.authService.revokeToken(id);
    return { message: REVOKED_ACCESS };
  }
}
