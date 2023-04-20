import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
export class findMessagePaginationQuery {
  @ApiProperty({
    type: String,
    title: 'conversation Id',
  })
  @IsString()
  @IsNotEmpty()
  conversationId: string;

  @ApiProperty({
    type: String,
    title: 'last message Id',
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  lastMessageId: string;
}
