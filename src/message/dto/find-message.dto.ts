import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';
export class findMessagePaginationQuery {
  @ApiProperty({
    type: String,
    title: 'conversation Id',
  })
  @IsString()
  @IsNotEmpty()
  conversationId: string;
}
