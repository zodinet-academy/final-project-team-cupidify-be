import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
  UseGuards,
} from '@nestjs/common';
import { LocationService } from './location.service';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthenticationGuard } from 'src/auth/guards/auth.guard';
import { User } from 'src/user/decorator/user.decorator';
import { UserDto } from 'src/user/dto/user.dto';
import { Location } from './entities/location.entity';

@Controller('location')
export class LocationController {
  constructor(private readonly locationService: LocationService) {}
  @ApiBearerAuth()
  @UseGuards(AuthenticationGuard)
  @Post()
  create(@User() user: UserDto, @Body() createLocationDto: Location) {
    createLocationDto = { userId: user.id, ...createLocationDto };
    return this.locationService.create(createLocationDto);
  }

  @ApiBearerAuth()
  @UseGuards(AuthenticationGuard)
  @Get()
  getWithin(@User() user: UserDto) {
    return this.locationService.findWithin(user.id);
  }

  // @Get()
  // findAll() {
  //   return this.locationService.findAll();
  // }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.locationService.findOne(+id);
  }

  @ApiBearerAuth()
  @UseGuards(AuthenticationGuard)
  @Put()
  update(@User() user: UserDto, @Body() updateLocationDto: UpdateLocationDto) {
    return this.locationService.update(user.id, updateLocationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.locationService.remove(+id);
  }
}
