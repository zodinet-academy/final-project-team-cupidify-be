import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { THttpResponse } from 'src/shared/common/http-response.dto';
import { Repository } from 'typeorm';
import { ConversationDto } from './dto/conversation.dto';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { Conversation } from './entities/conversation.entity';

@Injectable()
export class ConversationService {
  constructor(
    @InjectRepository(Conversation)
    private readonly _conversationRepository: Repository<Conversation>,
    @InjectMapper() private readonly _classMapper: Mapper,
  ) {}

  async create(
    createConversationDto: CreateConversationDto,
  ): Promise<THttpResponse<ConversationDto>> {
    try {
      const toSaveConversation = this._classMapper.map(
        createConversationDto,
        CreateConversationDto,
        Conversation,
      );
      const conversation = await this._classMapper.mapAsync(
        await this._conversationRepository.save(toSaveConversation),
        Conversation,
        ConversationDto,
      );
      return {
        statusCode: HttpStatus.CREATED,
        data: conversation,
      };
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }
}
