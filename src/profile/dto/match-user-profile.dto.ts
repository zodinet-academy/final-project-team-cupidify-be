import { ApiProperty } from '@nestjs/swagger';
import { AutoMap } from '@automapper/classes';

export class MatchedUserProfile {
  @AutoMap()
  @ApiProperty()
  id: string;

  @AutoMap()
  @ApiProperty()
  userId: string;

  @AutoMap()
  @ApiProperty()
  name: string;

  // avatar
  @AutoMap()
  @ApiProperty()
  avatar: string;
}
