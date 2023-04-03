import { ApiProperty } from '@nestjs/swagger';

export class PaginationQuery {
  @ApiProperty({
    minimum: 0,
    maximum: 10000,
    title: 'range',
  })
  range: number;
}
