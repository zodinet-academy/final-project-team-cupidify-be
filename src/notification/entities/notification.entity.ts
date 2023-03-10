import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

enum NotiType {
  Matching = 'matching',
  Message = 'message',
}

@Entity()
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'from_id' })
  fromId: string;

  @Column({ name: 'to_id' })
  toId: string;

  @Column({ name: 'is_seen' })
  isSeen: boolean;

  @Column('text')
  type: NotiType;

  @Column({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @Column({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;

  @Column({ name: 'deleted_at', type: 'timestamptz' })
  deletedAt: Date;
}
