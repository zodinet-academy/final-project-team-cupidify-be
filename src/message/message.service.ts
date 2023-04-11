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

      return {
        statusCode: HttpStatus.CREATED,
        data: message,
      };
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async create(
    @UploadedFile() file: Express.Multer.File,
    createMessageDto: CreateMessageDto,
  ): Promise<THttpResponse<CreateMessageDto>> {
    try {
      if (createMessageDto.isSeen === 'false') createMessageDto.isSeen = false;
      if (createMessageDto.isSeen === 'true') createMessageDto.isSeen = true;

      if (file) {
        const image = await this._cloudinaryService.uploadImageToCloudinary(
          file,
        );
        createMessageDto.content = image.data.photoUrl;
        createMessageDto.type = MessageType.IMAGE;
      }

      const message = await this._messageRepository.save(createMessageDto);

      return {
        statusCode: HttpStatus.CREATED,
        data: message,
      };
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async findAll(
    conversationId: string,
    page: number,
    limit: number,
  ): Promise<THttpResponse<{ totalPages: number; messages: MessageDto[] }>> {
    try {
      const [messages, total] = await this._messageRepository.findAndCount({
        where: { conversationId },
        order: { createdAt: 'DESC' },
        skip: (page - 1) * limit,
        take: limit,
      });

      const mapMessages = await this._classMapper.mapArrayAsync(
        messages,
        Message,
        MessageDto,
      );

      const totalPages = Math.ceil(total / limit);

      return {
        statusCode: HttpStatus.OK,
        data: {
          totalPages,
          messages: mapMessages,
        },
      };
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }
}
