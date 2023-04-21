import { Controller, Post, Body, UseGuards, Get } from '@nestjs/common';
import { THttpResponse } from 'src/shared/common/http-response.dto';
import { ConversationService } from './conversation.service';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthenticationGuard } from '../auth/guards/auth.guard';
import { User } from '../user/decorator/user.decorator';
import { UserDto } from '../user/dto/user.dto';
import { ProfileConversationDto } from '../profile/dto/profile-conversation.dto';
@ApiTags('Conversation')
@Controller('conversation')
export class ConversationController {
  constructor(private readonly conversationService: ConversationService) {}

  @ApiOperation({ summary: 'Create Conversation Chat' })
  @ApiBearerAuth()
  @UseGuards(AuthenticationGuard)
  @Post()
  create(
    @User() user: UserDto,
    @Body() createConversationDto: CreateConversationDto,
  ): Promise<
    THttpResponse<{
      conversationId: string;
      userProfile: ProfileConversationDto;
    }>
  > {
    createConversationDto.userFromId = user.id;
    return this.conversationService.create(createConversationDto);
  }

  @ApiOperation({ summary: 'Get Conversation Chat' })
  @ApiBearerAuth()
  @UseGuards(AuthenticationGuard)
  @Get()
  getConversationsById(@User() user: UserDto): Promise<
    THttpResponse<
      {
        conversationId: string;
        userProfile: ProfileConversationDto;
      }[]
    >
  > {
    return this.conversationService.getConversationsById(user.id);
  }
}
