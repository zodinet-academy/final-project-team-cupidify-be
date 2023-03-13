import { IsBoolean, IsString } from 'class-validator';
import { PrimaryGeneratedColumn, Column } from 'typeorm';
import { JoinColumn } from 'typeorm/decorator/relations/JoinColumn';
import { ManyToOne } from 'typeorm/decorator/relations/ManyToOne';
import { Conversation } from '../../conversation/entities/conversation.entity';
export class Message {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Conversation, (conversation) => conversation.messages)
  conversation: Conversation;

  @Column({ name: 'sender_id', type: 'uuid' })
  sender_id: string;

  @Column({ name: 'from_id', type: 'uuid' })
  from_id: string;

  @Column({ name: 'content' })
  @IsString()
  content: string;

  @Column({ name: 'is_seen' })
  @IsBoolean()
  isSeen: boolean;

  @Column({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @Column({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;

  @Column({ name: 'deleted_at', type: 'timestamptz' })
  deletedAt: Date;
}
