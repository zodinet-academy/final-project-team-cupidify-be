import { AutoMap } from '@automapper/classes';
import { Message } from 'src/message/entities/message.entity';

export class ConversationDto {
  @AutoMap()
  userFromId: string;

  @AutoMap()
  userToId: string;

  @AutoMap()
  messages: Message[];
}
