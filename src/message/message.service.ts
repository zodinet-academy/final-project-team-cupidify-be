import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UploadedFile,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, DataSource, Repository } from 'typeorm';
import { CreateMessageDto } from './dto/create-message.dto';
import { Message } from './entities/message.entity';
import { Server } from 'socket.io';
import { MessageDto } from './dto/message-dto';
import { THttpResponse } from 'src/shared/common/http-response.dto';
import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { MessageType } from '../shared/enums';
import { IConversationProfile } from '../profile/interfaces';
import { MessageConversation } from './dto/message-conversation.dto';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message)
    private readonly _messageRepository: Repository<Message>,
    @InjectMapper() private readonly _classMapper: Mapper,
    private readonly _cloudinaryService: CloudinaryService,
    private readonly _dataSource: DataSource,
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

  async getLastMessage(otherUserIds: IConversationProfile[]) {
    try {
      const lastMessages = await Promise.all(
        otherUserIds.map(async (u) => {
          return await this._dataSource
            .createQueryBuilder(Message, 'mess')
            .where(
              new Brackets((query) =>
                query.where('mess.conversationId = :conversationId', {
                  conversationId: u.conversationId,
                }),
              ),
            )
            .orderBy('mess.updatedAt', 'DESC')
            .getOne();
        }),
      );

      if (!lastMessages) {
        throw new NotFoundException('Not Found Messages');
      }

      const mapLastMessages = await this._classMapper.mapArrayAsync(
        lastMessages,
        Message,
        MessageConversation,
      );

      return mapLastMessages;
    } catch (err) {
      throw new BadRequestException('Error Get Last Message');
    }
  }
}
