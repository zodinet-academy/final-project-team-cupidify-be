import { NotiType } from 'src/shared/enum';
import { User } from 'src/user/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'is_seen' })
  isSeen: boolean;

  @Column('text')
  type: NotiType;

  @ManyToOne(() => User, (user) => user.notification, { onDelete: 'CASCADE' })
  fromUser: User;

  @ManyToOne(() => User, (user) => user.notification, { onDelete: 'CASCADE' })
  toUser: User;

  @Column({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @Column({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;

  @Column({ name: 'deleted_at', type: 'timestamptz' })
  deletedAt: Date;
}
