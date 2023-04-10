import { AutoMap } from '@automapper/classes';

export class MessageDto {
  @AutoMap()
  conversationId: string;

  @AutoMap()
  senderId: string;

  @AutoMap()
  receiverId: string;

  @AutoMap()
  content: string;

  @AutoMap()
  isSeen: boolean;

  @AutoMap()
  createdAt: Date;

  @AutoMap()
  type: string;
}
