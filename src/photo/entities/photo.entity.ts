import { User } from 'src/user/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Photo {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // @Column({ name: 'user_id', type: 'uuid' })
  // userId: string;

  @Column({ name: 'photo_url' })
  photoUrl: string;

  @Column({ name: 'is_favorite' })
  isFavorite: boolean;

  @Column({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @Column({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;

  @Column({ name: 'deleted_at', type: 'timestamptz' })
  deletedAt: Date;

  // @ManyToOne(() => User, (user) => user.photos)
  // user: User;
}
