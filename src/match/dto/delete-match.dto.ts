import { AutoMap } from '@automapper/classes';

export class DeleteMatchDto {
  @AutoMap()
  userId: string;

  @AutoMap()
  matchedId: string;

  // @AutoMap()
  // status: string;
}
