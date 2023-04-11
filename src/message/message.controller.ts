import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  UploadedFile,
  UseInterceptors,
  Query,
  Param,
} from '@nestjs/common';
import { MessageService } from './message.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthenticationGuard } from 'src/auth/guards/auth.guard';
import { THttpResponse } from 'src/shared/common/http-response.dto';
import { MessageDto } from './dto/message-dto';
import { FileInterceptor } from '@nestjs/platform-express';

import { findMessagePaginationQuery } from './dto/find-message.dto';
import { MessageGateway } from './message.gateway';
@ApiTags('Message')
@Controller('message')
export class MessageController {
  constructor(
    private readonly messageService: MessageService,
    private readonly _messageGateway: MessageGateway,
  ) {}

  @ApiBearerAuth()
  @UseGuards(AuthenticationGuard)
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() createMessageDto: CreateMessageDto,
  ) {
    const res = await this.messageService.create(file, createMessageDto);

    await this._messageGateway.sendMessage(res.data);

    return res;
  }

  @ApiOperation({ summary: 'Get All message' })
  @ApiBearerAuth()
  @UseGuards(AuthenticationGuard)
  @Get()
  findAll(
    @Query() paginationQuery: findMessagePaginationQuery,
    @Query('page') page = 1,
    @Query('limit') limit = 20,
  ): Promise<THttpResponse<{ totalPages: number; messages: MessageDto[] }>> {
    return this.messageService.findAll(
      paginationQuery.conversationId,
      page,
      limit,
    );
  }
}
