import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { THttpResponse } from 'src/shared/common/http-response.dto';
import { Brackets, DataSource, Repository } from 'typeorm';
import { ConversationDto } from './dto/conversation.dto';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { Conversation } from './entities/conversation.entity';
import { MatchService } from '../match/match.service';
import { CreateMatchDto } from '../match/dto/create-match.dto';
import { Profile } from '../profile/entities/profile.entity';

@Injectable()
export class ConversationService {
  constructor(
    @InjectRepository(Conversation)
    private readonly _conversationRepository: Repository<Conversation>,
    private _dataSource: DataSource,
    private readonly _matchService: MatchService,
    @InjectMapper() private readonly _classMapper: Mapper,
  ) {}

  async create(
    createConversationDto: CreateConversationDto,
  ): Promise<THttpResponse<ConversationDto>> {
    try {
      const findMatch: CreateMatchDto = {
        userId: createConversationDto.userFromId,
        matchedId: createConversationDto.userToId,
      };
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
      const responseUpdateMatch = await this._matchService.updateIsChat(
        findMatch,
      );

      return {
        statusCode: HttpStatus.CREATED,
        data: conversation,
      };
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }
  async getConversationsById(userId: string) {
    try {
      // const conversations = await this._conversationRepository.find({
      //   where: [{ userFromId: userId }, { userToId: userId }],
      // });

      console.log('User Id: ', userId);

      const conUserProfile = await this._dataSource.manager
        .createQueryBuilder(Conversation, 'con')
        .leftJoinAndSelect(
          'con.userTo',
          'user',
          'user.id = con.userFromId OR user.id = con.userToId',
        )
        .leftJoinAndSelect('user.profile', 'pro')
        .where(
          new Brackets((query) => {
            query
              .where('con.userFromId = :userId', { userId })
              .orWhere('con.userToId = :userId', { userId });
          }),
        )
        // .select('con')
        // .select('pro')
        // .from(Profile, 'pro')
        // .where(
        //   new Brackets((query) => {
        //     query
        //       .where('con.userFromId = :userId', { userId })
        //       .andWhere('pro.userId = con.userToId');
        //   }),
        // )
        // .orWhere(
        //   new Brackets((query) => {
        //     query
        //       .where('con.userToId = :userId', { userId })
        //       .andWhere('pro.userId = con.userFromId');
        //   }),
        // )
        .getMany();

      console.log('Conversation profile: ', conUserProfile);
      return {
        statusCode: HttpStatus.OK,
        data: conUserProfile,
      };
    } catch (error) {
      console.log(error);
      throw new BadRequestException(error.message);
    }
  }
}
