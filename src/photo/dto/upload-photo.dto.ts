import { AutoMap } from '@automapper/classes';

export class UploadPhotoDto {
  @AutoMap()
  userId: string;

  @AutoMap()
  photoUrl: string;

  @AutoMap()
  publicId: string;

  @AutoMap()
  isFavorite: boolean;
}
