import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  UploadedFile,
  UseInterceptors,
  Query,
} from '@nestjs/common';
import { MessageService } from './message.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthenticationGuard } from 'src/auth/guards/auth.guard';
import { THttpResponse } from 'src/shared/common/http-response.dto';
import { MessageDto } from './dto/message-dto';
import { FileInterceptor } from '@nestjs/platform-express';

import { findMessagePaginationQuery } from './dto/find-message.dto';
@ApiTags('Message')
@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @ApiBearerAuth()
  @UseGuards(AuthenticationGuard)
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  create(
    @UploadedFile() file: Express.Multer.File,
    @Body() createMessageDto: CreateMessageDto,
  ) {
    return this.messageService.create(file, createMessageDto);
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
