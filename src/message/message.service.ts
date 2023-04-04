import {
  BadRequestException,
  HttpStatus,
  Injectable,
  UploadedFile,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateMessageDto } from './dto/create-message.dto';
import { Message } from './entities/message.entity';
import { Server } from 'socket.io';
import { MessageDto } from './dto/message-dto';
import { THttpResponse } from 'src/shared/common/http-response.dto';
import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { MessageType } from 'src/shared/enums';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message)
    private readonly _messageRepository: Repository<Message>,
    @InjectMapper() private readonly _classMapper: Mapper,
    private readonly _cloudinaryService: CloudinaryService,
  ) {}

  async sendMessage(
    server: Server,
    createMessageDto: CreateMessageDto,
  ): Promise<THttpResponse<MessageDto>> {
    try {
      const message = await this._messageRepository.save(createMessageDto);
      // server.to(message.conversationId).emit('message', message);
      return {
        statusCode: HttpStatus.CREATED,
        data: message,
      };
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async create(
    createMessageDto: CreateMessageDto,
  ): Promise<THttpResponse<MessageDto>> {
    try {
      // if (file) {
      //   const image = await this._cloudinaryService.uploadImageToCloudinary(
      //     file,
      //   );
      //   createMessageDto.content = image.data.photoUrl;
      //   createMessageDto.type = MessageType.IMAGE;
      // }

      const toSaveMessage = this._classMapper.map(
        createMessageDto,
        CreateMessageDto,
        Message,
      );

      const message = await this._classMapper.mapAsync(
        await this._messageRepository.save(toSaveMessage),
        Message,
        MessageDto,
      );
      return {
        statusCode: HttpStatus.CREATED,
        data: message,
      };
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async findAll(conversationId: string): Promise<THttpResponse<MessageDto[]>> {
    try {
      const messages = await this._classMapper.mapArrayAsync(
        await this._messageRepository.find({
          where: { conversationId },
        }),
        Message,
        MessageDto,
      );
      return {
        statusCode: HttpStatus.OK,
        data: messages,
      };
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }
}
