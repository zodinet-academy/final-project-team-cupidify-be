import { ApiProperty } from '@nestjs/swagger';
import { AutoMap } from '@automapper/classes';

export class FindMatchDto {
  @AutoMap()
  @ApiProperty()
  id: string;

  @AutoMap()
  @ApiProperty()
  userId: string;

  @AutoMap()
  @ApiProperty()
  matchedId: string;

  @AutoMap()
  @ApiProperty()
  status: boolean;

  @AutoMap()
  @ApiProperty()
  isChat: boolean;
}
