import { IsEmail, MaxLength, MinLength } from 'class-validator';
import { BlackList } from 'src/black-list/entities/black-list.entity';
import { Location } from 'src/location/entities/location.entity';
import { Match } from 'src/match/entities/match.entity';
import { Notification } from 'src/notification/entities/notification.entity';
import { Photo } from 'src/photo/entities/photo.entity';
import { Profile } from 'src/profile/entities/profile.entity';
import { Base } from 'src/shared/base.entity';
import { Column, Entity, OneToMany, OneToOne } from 'typeorm';

@Entity({ name: 'user', synchronize: true })
export class User extends Base {
  @Column({ name: 'phone', unique: true })
  @MinLength(15)
  @MaxLength(15)
  phone: string;

  @Column({ name: 'social_id' })
  socialId: string;

  @Column({ name: 'email' })
  @IsEmail()
  email: string;

  @OneToOne(() => Profile, (profile) => profile.user)
  profile: Profile;

  @OneToMany(() => Match, (match) => match.user)
  matches: Match[];

  @OneToMany(() => Photo, (photo) => photo.user)
  photos: Photo[];

  @OneToMany(() => Notification, (notification) => notification.fromUser)
  notifications: Notification[];

  @OneToMany(() => BlackList, (blackList) => blackList.user)
  blackList: BlackList[];

  @OneToOne(() => Location, (location) => location.user)
  location: Location;
}
