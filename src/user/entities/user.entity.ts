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
import { Profile } from 'src/profile/entities/profile.entity';
import { Match } from 'src/match/entities/match.entity';

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
}
