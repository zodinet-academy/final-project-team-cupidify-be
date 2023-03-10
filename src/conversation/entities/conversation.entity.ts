import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

@Entity({ name: 'conversation', synchronize: true })
export class Conversation {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ name: 'from_id', type: 'uuid' })
  from_id: string;
  @Column({ name: 'to_id', type: 'uuid' })
  to_id: string;
  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;
}
