import { User } from './../../user/entities/user.entity';
import { Entity, Column, OneToOne, JoinColumn } from 'typeorm';
import { MinLength, IsDate, IsString } from 'class-validator';
import { Base } from '../../shared/base.entity';
import { Gender } from '../../shared/enums/index';

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

  @Column({ name: 'description', nullable: true })
  @IsString()
  description: string;

  @Column({ name: 'float', nullable: true })
  height: number;

  @Column({ name: 'religion', nullable: true })
  religion: string;

  @Column({ name: 'drinking', nullable: true })
  drinking: boolean;

  @Column({ name: 'education', nullable: true })
  education: string;

  @Column({ name: 'have_children', nullable: true })
  haveChildren: boolean;

  @Column('text', { name: 'interests', array: true, nullable: true })
  interests: string[];
}
