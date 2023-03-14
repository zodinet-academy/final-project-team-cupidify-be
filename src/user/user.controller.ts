import { Controller, Post, Body, Get } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly _userService: UserService) {}

  @Post('check-phone')
  async isPhoneExist(@Body() phone: string): Promise<string> {
    return await this._userService.isPhoneExist(phone);
  }
}
