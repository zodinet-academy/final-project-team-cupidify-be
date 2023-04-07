import { AutoMap } from '@automapper/classes';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Base } from '../../shared/base.entity';
import { NotiType } from '../../shared/enums/index';
import { User } from '../../user/entities/user.entity';

@Entity()
export class Notification extends Base {
  @AutoMap()
  @Column({ name: 'from_id' })
  userFromId: string;

  @AutoMap()
  @Column({ name: 'to_id' })
  userToId: string;

  @AutoMap()
  @ManyToOne(() => User, (user) => user.notifications, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'from_id' })
  fromUser: User;

  @AutoMap()
  @ManyToOne(() => User, (user) => user.notifications, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'to_id' })
  toUser: User;

  @AutoMap()
  @Column({ name: 'is_seen' })
  isSeen: boolean;

  @AutoMap()
  @Column('text')
  type: NotiType;
}
