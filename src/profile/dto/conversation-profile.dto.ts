import { AutoMap } from '@automapper/classes';

export class ConversationProfileDto {
  @AutoMap()
  userId: string;

  @AutoMap()
  name: string;

  @AutoMap()
  avatar: string;
}
