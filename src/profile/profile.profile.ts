import { ConversationProfileDto } from './dto/conversation-profile.dto';
import {
  createMap,
  forMember,
  ignore,
  mapFrom,
  Mapper,
} from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { Injectable } from '@nestjs/common';
import { CreateProfileDto } from './dto/create-profile.dto';
import { ProfileDto } from './dto/profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { Profile } from './entities/profile.entity';
import { MatchedUserProfile } from './dto/match-user-profile.dto';
import { ProfileConversationDto } from './dto/profile-conversation.dto';

@Injectable()
export class ProfileProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return (mapper) => {
      createMap(
        mapper,
        Profile,
        ProfileDto,
        forMember(
          (dest) => dest.interests,
          mapFrom((src) => src.interests),
        ),
      );
      createMap(
        mapper,
        CreateProfileDto,
        Profile,
        forMember((dest) => dest.id, ignore()),
      );
      createMap(mapper, UpdateProfileDto, Profile);
      createMap(mapper, Profile, MatchedUserProfile);
      createMap(mapper, Profile, ConversationProfileDto);
      createMap(mapper, Profile, ProfileConversationDto);
    };
  }
}
