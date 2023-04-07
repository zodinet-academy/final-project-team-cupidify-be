import {
  Mapper,
  createMap,
  forMember,
  mapFrom,
  ignore,
} from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { Injectable } from '@nestjs/common';
import { ConversationDto } from './dto/conversation.dto';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { Conversation } from './entities/conversation.entity';
import { ProfileConversationDto } from './dto/profile-conversation.dto';
import { Profile } from '../profile/entities/profile.entity';

@Injectable()
export class ConversationProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return (mapper) => {
      createMap(
        mapper,
        Conversation,
        ConversationDto,
        forMember(
          (dest) => dest.messages,
          mapFrom((src) => src.messages),
        ),
      );
      createMap(
        mapper,
        CreateConversationDto,
        Conversation,
        // forMember((dest) => dest.id, ignore()),
      );
      createMap(mapper, Profile, ProfileConversationDto);
    };
  }
}
