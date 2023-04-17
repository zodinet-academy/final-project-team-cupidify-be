import { Match } from './entities/match.entity';
import { Injectable } from '@nestjs/common';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { Mapper, createMap } from '@automapper/core';
import { FindMatchDto } from './dto/find-match.dto';
import { DeleteMatchDto } from './dto/delete-match.dto';

@Injectable()
export class MatchProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return (mapper) => {
      createMap(mapper, Match, FindMatchDto);
      createMap(mapper, DeleteMatchDto, Match);
    };
  }
}
