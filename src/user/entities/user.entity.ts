import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToOne,
  OneToMany,
} from 'typeorm';
import { MinLength, MaxLength, IsEmail } from 'class-validator';
import { Profile } from '../../profile/entities/profile.entity';
import { Match } from '../../match/entities/match.entity';
import { BlackList } from '../../black-list/entities/black-list.entity';
import { Notification } from '../../notification/entities/notification.entity';
import { Photo } from '../../photo/entities/photo.entity';

@Entity({ name: 'user', synchronize: true })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'phone', unique: true })
  @MinLength(15)
  @MaxLength(15)
  phone: string;

  @Column({ name: 'social_id' })
  socialId: string;

  @Column({ name: 'email' })
  @IsEmail()
  email: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;

  @OneToOne(() => Profile, (profile) => profile.user_id)
  profile: Profile;

  @OneToMany(() => Match, (match) => match.user_id)
  matches: Match[];

  @OneToMany(() => Photo, (photo) => photo.user)
  photos: Photo[];

  @OneToMany(() => Notification, (notification) => notification.fromUser)
  notifications: Notification[];

  @OneToOne(() => BlackList, (blackList) => blackList.user)
  blackList: BlackList;
}
