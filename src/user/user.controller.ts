import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthenticationGuard } from '../auth/guards/auth.guard';
import { TCheckedResponse } from '../shared/common/check-response.dto';
import { User } from './decorator/user.decorator';
import { PhoneDto } from './dto/phone.dto';
import { SocialDto } from './dto/social.dto';
import { UserDto } from './dto/user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly _userService: UserService) {}

  @ApiBearerAuth()
  @UseGuards(AuthenticationGuard)
  @Get()
  async findById(@User() user: UserDto) {
    console.log(user);
    return await this._userService.findById(user.id);
  }

  @Post('check-phone')
  async isPhoneExist(
    @Body() checkPhone: PhoneDto,
  ): Promise<TCheckedResponse<UserDto>> {
    return await this._userService.isPhoneExist(checkPhone.phone);
  }

  @Post('check-social')
  async isSocialExist(
    @Body() checkSocial: SocialDto,
  ): Promise<{ checked?: boolean; phone?: string }> {
    return await this._userService.isSocialExist(checkSocial.socialId);
  }

  @Get('/findall')
  findAll() {
    return this._userService.findAll();
  }
}
