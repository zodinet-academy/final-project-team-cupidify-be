import { Controller, Post, Body } from '@nestjs/common';
import { THttpResponse } from 'src/shared/common/http-response.dto';
import { ConversationService } from './conversation.service';
import { ConversationDto } from './dto/conversation.dto';
import { CreateConversationDto } from './dto/create-conversation.dto';

@Controller('conversation')
export class ConversationController {
  constructor(private readonly conversationService: ConversationService) {}

  @Post()
  create(
    @Body() createConversationDto: CreateConversationDto,
  ): Promise<THttpResponse<ConversationDto>> {
    return this.conversationService.create(createConversationDto);
  }
}
