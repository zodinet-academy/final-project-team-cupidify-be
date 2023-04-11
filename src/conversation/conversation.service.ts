import { MessageConversation } from './dto/message-conversation.dto';
import { ProfileConversationDto } from './dto/profile-conversation.dto';
import { ProfileService } from './../profile/profile.service';
import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { THttpResponse } from 'src/shared/common/http-response.dto';
import { DataSource, Repository, Brackets } from 'typeorm';
import { ConversationDto } from './dto/conversation.dto';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { Conversation } from './entities/conversation.entity';
import { MatchService } from '../match/match.service';
import { CreateMatchDto } from '../match/dto/create-match.dto';
import { Profile } from '../profile/entities/profile.entity';
import { MessageGateway } from '../message/message.gateway';
import {
  IConversation,
  IConversationSocket,
  IConversationProfile,
} from './interface';
import { Message } from 'src/message/entities/message.entity';

@Injectable()
export class ConversationService {
  constructor(
    @InjectRepository(Conversation)
    private readonly _conversationRepository: Repository<Conversation>,
    private _dataSource: DataSource,
    private readonly _matchService: MatchService,
    private readonly _profileService: ProfileService,
    @InjectMapper() private readonly _classMapper: Mapper,
    private readonly _messageGateway: MessageGateway,
  ) {}

  async create(
    createConversationDto: CreateConversationDto,
  ): Promise<THttpResponse<IConversation>> {
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
      // Send data me to friend
      const resProfileMe = await this._profileService.findOneByUserId(
        createConversationDto.userFromId,
      );
      const profileMe = resProfileMe.data;
      const sendConversation: IConversationSocket = {
        conversationId: conversation.id,
        userProfile: {
          userId: profileMe.userId,
          name: profileMe.name,
          avatar: profileMe.avatar,
        },
        sendUserId: createConversationDto.userToId,
      };

      // create conversation
      this._messageGateway.sendConversation(sendConversation);

      // Send data user friend to me
      const res = await this._profileService.findOneByUserId(
        createConversationDto.userToId,
      );
      const profile = res.data;
      const { userId, name, avatar } = profile;
      const conversationRes: IConversation = {
        conversationId: conversation.id,
        userProfile: {
          userId,
          name,
          avatar,
        },
      };

      return {
        statusCode: HttpStatus.CREATED,
        data: conversationRes,
      };
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async getConversationProfile(otherUserIds: IConversationProfile[]) {
    try {
      const profiles = await this._dataSource.manager
        .createQueryBuilder(Profile, 'pro')
        .where('pro.userId IN (:...userIds)', {
          userIds: otherUserIds.map((u) => u.userId),
        })
        .getMany();

      if (profiles.length === 0) {
        throw new NotFoundException('Not Found Conversations');
      }

      const mapProfile = await this._classMapper.mapArrayAsync(
        profiles,
        Profile,
        ProfileConversationDto,
      );

      return mapProfile;
    } catch (err) {
      throw new BadRequestException('Error Get Conversation Profiles');
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

  async getConversationsById(userId: string): Promise<
    THttpResponse<
      {
        conversationId: string;
        userProfile: ProfileConversationDto;
      }[]
    >
  > {
    try {
      const conversations = await this._conversationRepository.find({
        where: [{ userFromId: userId }, { userToId: userId }],
        order: {
          updatedAt: 'DESC',
        },
      });

      if (conversations.length === 0) {
        throw new NotFoundException('Not Found Conversations');
      }

      const otherUserIds = conversations.map((c) => {
        return {
          conversationId: c.id,
          userId: c.userFromId === userId ? c.userToId : c.userFromId,
        };
      });

      const [mapLastMessages, mapProfile] = await Promise.all([
        await this.getLastMessage(otherUserIds),
        await this.getConversationProfile(otherUserIds),
      ]);

      const result = otherUserIds.map((u) => {
        return {
          conversationId: u.conversationId,
          lastMessage: mapLastMessages.find((i) => {
            if (i.conversationId === u.conversationId) {
              return {
                content: i.content,
                senderId: i.senderId,
                type: i.type,
              };
            }
          }),
          userProfile: mapProfile.find((p) => {
            if (p.userId === u.userId) {
              return p;
            }
          }),
        };
      });

      return {
        statusCode: HttpStatus.OK,
        data: result,
      };
    } catch (error) {
      console.log(error);
      throw new BadRequestException(error.message);
    }
  }
}
