import { Base } from 'src/shared/base.entity';
import { User } from 'src/user/entities/user.entity';
import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';

@Entity({ name: 'match', synchronize: true })
export class Match extends Base {
  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: User;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'matched_id', referencedColumnName: 'id' })
  matched: User;

  @Column({ name: 'status' })
  status: boolean;
}
