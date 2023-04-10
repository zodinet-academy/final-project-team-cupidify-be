import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { MatchService } from './match.service';
import { CreateMatchDto } from './dto/create-match.dto';
import { UpdateMatchDto } from './dto/update-match.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthenticationGuard } from '../auth/guards/auth.guard';
import { FindMatchDto } from './dto/find-match.dto';
import { Match } from './entities/match.entity';
import { Put } from '@nestjs/common';
import { User } from '../user/decorator/user.decorator';
import { UserDto } from '../user/dto/user.dto';

@ApiTags('Match')
@Controller('match')
export class MatchController {
  constructor(private readonly _matchService: MatchService) {}

  @ApiOperation({ summary: 'Matching' })
  @ApiBearerAuth()
  @UseGuards(AuthenticationGuard)
  @Post()
  match(@User() user: UserDto, @Body() findMatchDto: FindMatchDto) {
    findMatchDto.userId = user.id;

    return this._matchService.match(findMatchDto);
  }

  @ApiOperation({ summary: 'Get user matches' })
  @ApiBearerAuth()
  @UseGuards(AuthenticationGuard)
  @Get()
  async getAll(@User() user) {
    const { id } = user;

    return await this._matchService.getMatches(id);
  }

  @Delete()
  remove(@Body() match) {
    return this._matchService.remove(match);
  }

  @ApiOperation({ summary: 'Update Matching' })
  @ApiBearerAuth()
  @UseGuards(AuthenticationGuard)
  @Post('/update-matching')
  updateMatching(@User() user: UserDto, @Body() findMatch: FindMatchDto) {
    findMatch.userId = user.id;

    return this._matchService.match(findMatch);
  }
}
