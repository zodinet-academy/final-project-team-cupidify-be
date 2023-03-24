import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Base } from '../../shared/base.entity';
import { User } from '../../user/entities/user.entity';
import { AutoMap } from '@automapper/classes';

@Entity({ name: 'photo', synchronize: true })
export class Photo extends Base {
  @AutoMap()
  @Column({ name: 'public_id' })
  publicId: string;

  @AutoMap()
  @Column({ name: 'user_id' })
  userId: string;

  @ManyToOne(() => User, (user) => user.photos, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @AutoMap()
  @Column({ name: 'photo_url' })
  photoUrl: string;

  @AutoMap()
  @Column({ name: 'is_favorite' })
  isFavorite: boolean;
}
