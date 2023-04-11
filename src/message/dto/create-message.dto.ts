import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsString } from 'class-validator';
import { MessageType } from 'src/shared/enums';

export class CreateMessageDto {
  @AutoMap()
  @ApiProperty({
    default: 'dd5ef115-3049-433e-9f43-c9b75b7afc13',
    type: String,
  })
  conversationId: string;

  @AutoMap()
  @ApiProperty({
    default: 'dd5ef115-3049-433e-9f43-c9b75b7afc13',
    type: String,
  })
  senderId: string;

  @AutoMap()
  @ApiProperty({
    default: 'dd5ef115-3049-433e-9f43-c9b75b7afc13',
    type: String,
  })
  receiverId: string;

  @AutoMap()
  @ApiProperty({
    default: 'Hello!',
    type: String,
  })
  @IsString()
  content: string;

  @AutoMap()
  @ApiProperty({
    default: false,
    type: Boolean,
  })
  // @IsBoolean()
  isSeen: any;

  @AutoMap()
  @ApiProperty({
    default: MessageType.TEXT,
    type: String,
  })
  @IsEnum(MessageType)
  type: MessageType;

  @AutoMap()
  @ApiProperty({
    type: Date,
    default: Date.now(),
  })
  createdAt: Date;
}
