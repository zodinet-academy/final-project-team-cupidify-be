import { UserEntity } from './../../user/entities/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { MinLength, IsDate, IsString } from 'class-validator';
import { Gender } from 'src/shared/enum';

@Entity({ name: 'profile', synchronize: true })
export class ProfileEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id', type: 'uuid' })
  @OneToOne(() => UserEntity, (user) => user.user) // specify inverse side as a second parameter
  @JoinColumn()
  user_id: UserEntity;

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

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;
}