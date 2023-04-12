import { AutoMap } from '@automapper/classes';
import { MessageType } from 'src/shared/enums';

export class MessageConversation {
  @AutoMap()
  conversationId: string;

  @AutoMap()
  content: string;

  @AutoMap()
  senderId: string;

  @AutoMap()
  type: MessageType;

  @AutoMap()
  createdAt: Date;
}
