import { AutoMap } from '@automapper/classes';

export class ProfileConversationDto {
  @AutoMap()
  userId: string;

  @AutoMap()
  name: string;

  @AutoMap()
  avatar: string;
}
