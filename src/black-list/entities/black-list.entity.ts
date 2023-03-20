import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Base } from '../../shared/base.entity';
import { User } from '../../user/entities/user.entity';

@Entity({ name: 'black_list', synchronize: true })
export class BlackList extends Base {
  @Column({ name: 'user_id' })
  userId: string;

  @ManyToOne(() => User, (user) => user.blackList, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'blocked_id' })
  blockedUserId: User;
}
