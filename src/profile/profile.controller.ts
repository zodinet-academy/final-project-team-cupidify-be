import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthenticationGuard } from '../auth/guards/auth.guard';
import { UserDto } from '../user/dto/user.dto';
import { User } from '../user/decorator/user.decorator';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Post()
  create(@Body() createProfileDto: CreateProfileDto) {
    return this.profileService.create(createProfileDto);
  }

  @ApiBearerAuth()
  @UseGuards(AuthenticationGuard)
  @Get()
  findProfile(@User() user: UserDto) {
    return this.profileService.findOneByUserId(user.id);
  }

  @ApiBearerAuth()
  @UseGuards(AuthenticationGuard)
  @Put()
  update(
    @User() user: UserDto,
    @Body()
    updateProfileDto: UpdateProfileDto,
  ) {
    return this.profileService.update(user.id, updateProfileDto);
  }
}
