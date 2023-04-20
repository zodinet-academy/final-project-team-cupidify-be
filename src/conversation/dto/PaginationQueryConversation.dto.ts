import { ApiProperty } from '@nestjs/swagger';

export class PaginationQueryConversation {
  @ApiProperty()
  conversationId: string;
}
