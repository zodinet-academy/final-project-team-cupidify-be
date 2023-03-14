import { PhoneDto } from './dto/phone.dto';
import { Controller, Post, Body, Get } from '@nestjs/common';
import { UserService } from './user.service';
import { SocialDto } from './dto/social.dto';

@Controller('user')
export class UserController {
  constructor(private readonly _userService: UserService) {}

  @Post('check-phone')
  async isPhoneExist(@Body() checkPhone: PhoneDto): Promise<boolean> {
    return await this._userService.isPhoneExist(checkPhone.phone);
  }

  @Post('check-social')
  async isSocialExist(
    @Body() checkSocial: SocialDto,
  ): Promise<{ phone: string }> {
    return await this._userService.isSocialExist(checkSocial.socialId);
  }
}
