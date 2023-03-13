import { IsBoolean, IsString } from 'class-validator';
import { Base } from 'src/shared/base.entity';
import { Column, Entity } from 'typeorm';
import { JoinColumn } from 'typeorm/decorator/relations/JoinColumn';
import { ManyToOne } from 'typeorm/decorator/relations/ManyToOne';
import { Conversation } from '../../conversation/entities/conversation.entity';

@Entity({ name: 'message', synchronize: true })
export class Message extends Base {
  @ManyToOne(() => Conversation, (conversation) => conversation.messages)
  @JoinColumn({ name: 'conversation_id', referencedColumnName: 'id' })
  conversation: Conversation;

  @Column({ name: 'sender_id', type: 'uuid' })
  sender_id: string;

  @Column({ name: 'receiver_id', type: 'uuid' })
  receiver_id: string;

  @Column({ name: 'content' })
  @IsString()
  content: string;

  @Column({ name: 'is_seen' })
  @IsBoolean()
  isSeen: boolean;
}
