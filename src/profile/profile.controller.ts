import { Controller, Get, Post, Body, Put, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthenticationGuard } from '../auth/guards/auth.guard';
import { User } from '../user/decorator/user.decorator';
import { UserDto } from '../user/dto/user.dto';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ProfileService } from './profile.service';

@ApiTags('Profile')
@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @ApiCreatedResponse({
    description: 'Create profile succesfully',
  })
  @Post()
  create(@Body() createProfileDto: CreateProfileDto) {
    return this.profileService.create(createProfileDto);
  }

  @ApiOkResponse({
    description: 'Get profile succesfully',
  })
  @ApiBearerAuth()
  @UseGuards(AuthenticationGuard)
  @Get()
  findProfile(@User() user: UserDto) {
    return this.profileService.findOneByUserId(user.id);
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.profileService.findOne(+id);
  // }

  @ApiOkResponse({
    description: 'Update profile succesfully',
  })
  @ApiBearerAuth()
  @UseGuards(AuthenticationGuard)
  @Put()
  update(
    @User() user: UserDto,
    @Body()
    updateProfileDto: UpdateProfileDto,
  ) {
    console.log(updateProfileDto);
    return this.profileService.update(user.id, updateProfileDto);
  }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.profileService.remove(+id);
  // }
}
