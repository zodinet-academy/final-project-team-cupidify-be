import { Base } from 'src/shared/base.entity';
import { User } from 'src/user/entities/user.entity';
import { Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity({ name: 'black_list', synchronize: true })
export class BlackList extends Base {
  @ManyToOne(() => User, (user) => user.blackList, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'blocked_id' })
  blockedUserId: User;
}
