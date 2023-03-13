import { User } from './../../user/entities/user.entity';
import { Entity, Column, OneToOne, JoinColumn } from 'typeorm';
import { MinLength, IsDate, IsString } from 'class-validator';
import { Base } from '../../shared/base.entity';
import { Gender } from '../../shared/enum';

@Entity({ name: 'profile', synchronize: true })
export class Profile extends Base {
  @OneToOne(() => User)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: User;

  @Column({ name: 'name' })
  @IsString()
  @MinLength(3)
  name: string;

  @Column({ name: 'gender', type: 'enum', enum: Gender })
  gender: Gender;

  @Column({ name: 'birthday' })
  @IsDate()
  birthday: Date;

  @Column({ name: 'description' })
  @IsString()
  description: string;

  @Column({ name: 'float' })
  height: number;

  @Column({ name: 'religion' })
  religion: string;

  @Column({ name: 'drinking' })
  drinking: boolean;

  @Column({ name: 'education' })
  @IsDate()
  education: string;

  @Column({ name: 'have_children' })
  haveChildren: boolean;

  @Column('text', { name: 'interests', array: true })
  @IsDate()
  interests: Date;
}
