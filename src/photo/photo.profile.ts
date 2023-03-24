import { PhotoDto } from './dto/photo.dto';
import { Photo } from './entities/photo.entity';
import { ignore } from '@automapper/core';
import { forMember } from '@automapper/core';
import { Injectable } from '@nestjs/common';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { Mapper, createMap } from '@automapper/core';
import { UploadPhotoDto } from './dto/upload-photo.dto';

@Injectable()
export class PhotoProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return (mapper) => {
      createMap(mapper, Photo, PhotoDto);
      createMap(
        mapper,
        UploadPhotoDto,
        Photo,
        forMember((dest) => dest.id, ignore()),
      );
    };
  }
}
