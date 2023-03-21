import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Base } from '../../shared/base.entity';
import { User } from '../../user/entities/user.entity';

@Entity({ name: 'match', synchronize: true })
export class Match extends Base {
  @Column({ name: 'user_id' })
  userId: string;

  @Column({ name: 'matched_id' })
  matchedId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: User;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'matched_id', referencedColumnName: 'id' })
  matched: User;

  @Column({ name: 'status' })
  status: boolean;
}
