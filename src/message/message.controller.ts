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
import { UpdateMessageDto } from './dto/update-message.dto';

@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Post()
  create(@Body() createMessageDto: CreateMessageDto) {
    return this.messageService.create(createMessageDto);
  }

  @Get()
  findAll() {
    return this.messageService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.messageService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMessageDto: UpdateMessageDto) {
    return this.messageService.update(+id, updateMessageDto);
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
