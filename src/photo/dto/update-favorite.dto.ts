import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class UpdateFavoriteDto {
  @ApiProperty({
    default: 'xx02cd1ztpfzl9fl19fg',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  publicId: string;

  @ApiProperty({
    default: false,
    type: Boolean,
  })
  @IsBoolean()
  isFavorite: boolean;
}
