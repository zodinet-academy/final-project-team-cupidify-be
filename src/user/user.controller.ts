import { TCheckedResponse } from '../shared/common/check-response.dto';
import { PhoneDto } from './dto/phone.dto';
import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { SocialDto } from './dto/social.dto';
import { UserDto } from './dto/user.dto';
import { User } from './decorator/user.decorator';
import { User as UserEntity } from './entities/user.entity';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthenticationGuard } from '../auth/guards/auth.guard';

@Controller('user')
export class UserController {
  constructor(private readonly _userService: UserService) {}

  // @ApiBearerAuth()
  // @UseGuards(AuthenticationGuard)
  // @Get()
  // async findById(@User() user: UserDto) {
  //   return await this._userService.findById(user);
  // }

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
}
