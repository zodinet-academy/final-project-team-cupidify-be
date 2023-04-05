import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  UploadedFile,
  Query,
} from '@nestjs/common';
import { MessageService } from './message.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthenticationGuard } from 'src/auth/guards/auth.guard';
import { THttpResponse } from 'src/shared/common/http-response.dto';
import { MessageDto } from './dto/message-dto';
import { findMessagePaginationQuery } from './dto/find-message.dto';
@ApiTags('Message')
@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @ApiBearerAuth()
  @UseGuards(AuthenticationGuard)
  @Post()
  create(
    @Body() createMessageDto: CreateMessageDto,
  ): Promise<THttpResponse<MessageDto>> {
    return this.messageService.create(createMessageDto);
  }

  @ApiOperation({ summary: 'Get All message' })
  @ApiBearerAuth()
  @UseGuards(AuthenticationGuard)
  @Get()
  findAll(
    @Query() paginationQuery: findMessagePaginationQuery,
  ): Promise<THttpResponse<MessageDto[]>> {
    return this.messageService.findAll(paginationQuery.conversationId);
  }
}
