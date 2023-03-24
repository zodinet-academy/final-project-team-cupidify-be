import { BlackListDto } from './dto/black-list.dto';
import { BlackList } from './entities/black-list.entity';
import { Injectable } from '@nestjs/common';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { Mapper, createMap } from '@automapper/core';

@Injectable()
export class BlackListProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return (mapper) => {
      createMap(mapper, BlackList, BlackListDto);
    };
  }
}
