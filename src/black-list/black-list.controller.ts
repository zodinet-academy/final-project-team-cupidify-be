import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BlackListService } from './black-list.service';
import { AddBlockedUserDto } from './dto/add-blocked-user.dto';
import { User } from '../user/decorator/user.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthenticationGuard } from 'src/auth/guards/auth.guard';
import { THttpResponse } from '../shared/common/http-response.dto';
import { BlackListDto } from './dto/black-list.dto';

@Controller('black-list')
export class BlackListController {
  constructor(private readonly blackListService: BlackListService) {}

  @ApiBearerAuth()
  @UseGuards(AuthenticationGuard)
  @Post()
  async addBlockedUser(
    @User() user,
    @Body() addBlockUser: AddBlockedUserDto,
  ): Promise<THttpResponse<{ id: string }>> {
    const { id } = user;
    return await this.blackListService.addBlockedUser(id, addBlockUser);
  }

  @ApiBearerAuth()
  @UseGuards(AuthenticationGuard)
  @Get()
  findAll() {
    return this.blackListService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.blackListService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBlackListDto: UpdateBlackListDto) {
    return this.blackListService.update(+id, updateBlackListDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.blackListService.remove(+id);
  }
}
