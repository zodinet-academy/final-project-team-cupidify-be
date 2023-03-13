import { Entity, ManyToOne, JoinColumn } from 'typeorm';
import { OneToMany } from 'typeorm/decorator/relations/OneToMany';
import { Message } from '../../message/entities/message.entity';
import { Base } from '../../shared/base.entity';
import { User } from '../../user/entities/user.entity';

@Entity({ name: 'conversation', synchronize: true })
export class Conversation extends Base {
  @ManyToOne(() => User)
  @JoinColumn({ name: 'from_id', referencedColumnName: 'id' })
  userFrom: User;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'to_id', referencedColumnName: 'id' })
  userTo: User;

  @OneToMany(() => Message, (message) => message.conversation)
  messages: Message[];
}
