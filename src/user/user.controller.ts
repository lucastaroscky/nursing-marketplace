import { Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from 'src/common/decorators/user.decorator';
import { AuthUser } from 'src/common/interfaces/auth-user.interface';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('ban')
  async banUser(@User() { userId }: AuthUser) {
    await this.userService.banUser(userId);
  }
}
