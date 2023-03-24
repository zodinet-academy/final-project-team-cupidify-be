import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class SetAvatarDto {
  @ApiProperty({
    default: 'xx02cd1ztpfzl9fl19fg',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  publicId: string;
}
