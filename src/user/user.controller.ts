import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { SessionCheckGuard } from 'src/common/guards/session-check.guard';

@Controller('user')
@UseGuards(SessionCheckGuard)
export class UserController {
  constructor(private userService: UserService) {}

  @Post('ban/:id')
  @HttpCode(HttpStatus.OK)
  async banUser(@Param() param: { id: string }) {
    await this.userService.banUser(param.id);
  }

  @Get('health-check')
  async healthCheck() {}
}
