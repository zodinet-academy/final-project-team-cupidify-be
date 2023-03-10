import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { MinLength, IsDate, IsString } from 'class-validator';

@Entity({ name: 'profile', synchronize: true })
export class ProfileEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id', type: 'uuid' })
  user_id: string;

  @Column({ name: 'name' })
  @IsString()
  @MinLength(3)
  name: string;

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
