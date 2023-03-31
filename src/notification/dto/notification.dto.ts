import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { NotiType } from 'src/shared/enums';
import { User } from 'src/user/entities/user.entity';
import { JoinColumn, OneToOne } from 'typeorm';

export class NotificationDto {
  @AutoMap()
  @ApiProperty({
    default: 'dd5ef115-3049-433e-9f43-c9b75b7afc13',
    type: String,
  })
  id: string;

  @AutoMap()
  userFromId: string;

  @AutoMap()
  @OneToOne(() => User)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  userFrom: User;

  @AutoMap()
  userToId: string;

  @AutoMap()
  @OneToOne(() => User)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  userTo: User;

  @AutoMap()
  isSeen: boolean;

  @AutoMap()
  type: NotiType;

  @AutoMap()
  createdAt: Date;
}
