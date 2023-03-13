import { Base } from 'src/shared/base.entity';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { User } from './../../user/entities/user.entity';

@Entity({ name: 'location', synchronize: true })
export class Location extends Base {
  @OneToOne(() => User, (user) => user.location, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: User;

  @Column('double precision')
  longitude: number;

  @Column('double precision')
  latitude: number;
}
