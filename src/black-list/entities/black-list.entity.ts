import { Base } from 'src/shared/base.entity';
import { User } from 'src/user/entities/user.entity';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';

@Entity({ name: 'balck_list', synchronize: true })
export class BlackList extends Base {
  @OneToOne(() => User, (user) => user.blackList, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'blocked_id' })
  blockedId: string[];
}
