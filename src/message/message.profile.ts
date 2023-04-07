import { Mapper, createMap, forMember, ignore } from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { MessageDto } from './dto/message-dto';
import { Message } from './entities/message.entity';

@Injectable()
export class MessageProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return (mapper) => {
      createMap(mapper, Message, MessageDto);
      createMap(
        mapper,
        CreateMessageDto,
        Message,
        forMember((dest) => dest.id, ignore()),
      );
    };
  }
}
