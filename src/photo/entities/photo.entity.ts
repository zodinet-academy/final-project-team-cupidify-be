import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Base } from '../../shared/base.entity';
import { User } from '../../user/entities/user.entity';

@Entity({ name: 'photo', synchronize: true })
export class Photo extends Base {
  @ManyToOne(() => User, (user) => user.photos, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'photo_url' })
  photoUrl: string;

  @Column({ name: 'is_favorite' })
  isFavorite: boolean;
}
