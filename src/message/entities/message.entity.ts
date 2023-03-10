import { PrimaryGeneratedColumn, Column } from 'typeorm';
export class Message {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ name: 'conversation_id', type: 'uuid' })
  conversation_id: string;
  @Column({ name: 'sender_id', type: 'uuid' })
  sender_id: string;

  @Column({ name: 'from_id', type: 'uuid' })
  from_id: string;

  @Column({ name: 'content' })
  content: string;

  @Column({ name: 'is_seen' })
  isSeen: boolean;

  @Column({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @Column({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;

  @Column({ name: 'deleted_at', type: 'timestamptz' })
  deletedAt: Date;
}
