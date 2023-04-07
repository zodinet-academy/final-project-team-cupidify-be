import { AutoMap } from '@automapper/classes';
import { IsBoolean, IsString } from 'class-validator';
import { MessageType } from '../../shared/enums/index';

import { Column, Entity } from 'typeorm';
import { JoinColumn } from 'typeorm/decorator/relations/JoinColumn';
import { ManyToOne } from 'typeorm/decorator/relations/ManyToOne';
import { Conversation } from '../../conversation/entities/conversation.entity';
import { Base } from '../../shared/base.entity';

@Entity({ name: 'message', synchronize: false })
export class Message extends Base {
  @AutoMap()
  @Column({ name: 'conversation_id' })
  conversationId: string;

  @AutoMap()
  @ManyToOne(() => Conversation, (conversation) => conversation.messages)
  @JoinColumn({ name: 'conversation_id', referencedColumnName: 'id' })
  conversation: Conversation;

  @AutoMap()
  @Column({ name: 'sender_id', type: 'uuid' })
  senderId: string;

  @AutoMap()
  @Column({ name: 'receiver_id', type: 'uuid' })
  receiverId: string;

  @AutoMap()
  @Column({ name: 'content' })
  @IsString()
  content: string;

  @AutoMap()
  @Column({ name: 'is_seen' })
  @IsBoolean()
  isSeen: boolean;

  @AutoMap()
  @Column({ name: 'type', type: 'enum', enum: MessageType })
  type: MessageType;
}
