import { Match } from 'src/match/entities/match.entity';
import { ignore } from '@automapper/core';
import { forMember } from '@automapper/core';
import { Injectable } from '@nestjs/common';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { Mapper, createMap } from '@automapper/core';
import { FindMatchDto } from './dto/find-match.dto';

@Injectable()
export class BlackListProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return (mapper) => {
      createMap(mapper, FindMatchDto, Match);
    };
  }
}
