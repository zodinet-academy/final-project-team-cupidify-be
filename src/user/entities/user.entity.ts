import { IsEmail, MaxLength, MinLength } from 'class-validator';
import { BlackList } from 'src/black-list/entities/black-list.entity';
import { Location } from 'src/location/entities/location.entity';
import { Match } from 'src/match/entities/match.entity';
import { Notification } from 'src/notification/entities/notification.entity';
import { Photo } from 'src/photo/entities/photo.entity';
import { Profile } from 'src/profile/entities/profile.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

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
  user: Profile;

  @OneToMany((type) => Match, (match) => match.user_id)
  matches: Match[];

  @OneToMany(() => Photo, (photo) => photo.user)
  photos: Photo[];

  @OneToMany(() => Notification, (notification) => notification.fromUser)
  notifications: Notification[];

  @OneToOne(() => BlackList, (blackList) => blackList.user)
  blackList: BlackList;

  @OneToOne(() => Location, (location) => location.user)
  location: Location;
}
