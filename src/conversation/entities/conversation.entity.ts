import { AutoMap } from '@automapper/classes';
import { Entity, ManyToOne, JoinColumn, Column } from 'typeorm';
import { OneToMany } from 'typeorm/decorator/relations/OneToMany';
import { Message } from '../../message/entities/message.entity';
import { Base } from '../../shared/base.entity';
import { User } from '../../user/entities/user.entity';

@Entity({ name: 'conversation', synchronize: true })
export class Conversation extends Base {
  @AutoMap()
  @Column({ name: 'from_id' })
  userFromId: string;

  @AutoMap()
  @Column({ name: 'to_id' })
  userToId: string;

  @AutoMap()
  @ManyToOne(() => User)
  @JoinColumn({ name: 'from_id', referencedColumnName: 'id' })
  userFrom: User;

  @AutoMap()
  @ManyToOne(() => User)
  @JoinColumn({ name: 'to_id', referencedColumnName: 'id' })
  userTo: User;

  @AutoMap()
  @OneToMany(() => Message, (message) => message.conversation)
  messages: Message[];
}
