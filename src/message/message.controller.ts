import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  UploadedFile,
} from '@nestjs/common';
import { MessageService } from './message.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthenticationGuard } from 'src/auth/guards/auth.guard';
import { THttpResponse } from 'src/shared/common/http-response.dto';
import { MessageDto } from './dto/message-dto';

@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @ApiBearerAuth()
  @UseGuards(AuthenticationGuard)
  @Post()
  create(
    @Body() createMessageDto: CreateMessageDto,
  ): Promise<THttpResponse<MessageDto>> {
    console.log('hello');
    console.log(createMessageDto);
    return this.messageService.create(createMessageDto);
  }

  @ApiBearerAuth()
  @UseGuards(AuthenticationGuard)
  @Get()
  findAll(roomId: string): Promise<THttpResponse<MessageDto[]>> {
    return this.messageService.findAll(roomId);
  }
}
