import { AutoMap } from '@automapper/classes';

export class MessageConversation {
  @AutoMap()
  conversationId: string;

  @AutoMap()
  content: string;

  @AutoMap()
  senderId: string;
}
