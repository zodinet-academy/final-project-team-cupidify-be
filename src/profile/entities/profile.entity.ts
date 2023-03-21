import { User } from './../../user/entities/user.entity';
import { Entity, Column, OneToOne, JoinColumn } from 'typeorm';
import { MinLength, IsString } from 'class-validator';
import { Base } from '../../shared/base.entity';
import { Education, Gender, Religion } from '../../shared/enums/index';

@Entity({ name: 'profile', synchronize: true })
export class Profile extends Base {
  @Column({ name: 'user_id' })
  userId: string;

  @OneToOne(() => User)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: User;

  @Column({ name: 'name' })
  @IsString()
  @MinLength(3)
  name: string;

  @Column({ name: 'gender', type: 'enum', enum: Gender })
  gender: Gender;

  @Column({ name: 'avatar' })
  avatar: string;

  @Column({ name: 'reason' })
  reason: string;

  @Column({ name: 'birthday', type: 'date' })
  birthday: string;

  @Column({ name: 'description', nullable: true })
  @IsString()
  description: string;

  @Column({ name: 'height', nullable: true })
  height: number;

  @Column({ name: 'religion', type: 'enum', enum: Religion, nullable: true })
  religion: Religion;

  @Column({ name: 'drinking', nullable: true })
  drinking: boolean;

  @Column({ name: 'education', type: 'enum', enum: Education, nullable: true })
  education: Education;

  @Column({ name: 'have_children', nullable: true })
  haveChildren: boolean;

  @Column('text', { name: 'interests', array: true, nullable: true })
  interests: string[];
}
