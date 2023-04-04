import { Injectable, BadRequestException, HttpStatus } from '@nestjs/common';
import { Conversation } from './entities/conversation.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { THttpResponse } from 'src/shared/common/http-response.dto';

@Injectable()
export class ConversationService {
  constructor(
    @InjectRepository(Conversation)
    private readonly _conversation: Repository<Conversation>,
  ) {}

  async createConversation(
    userFromId: string,
    userToId: string,
  ): Promise<THttpResponse<void>> {
    try {
      const result = await this._conversation.save({ userFromId, userToId });

      return {
        statusCode: HttpStatus.CREATED,
        message: 'Conversation created',
      };
    } catch (err) {
      throw new BadRequestException('Error Creating Conversation');
    }
  }
}
