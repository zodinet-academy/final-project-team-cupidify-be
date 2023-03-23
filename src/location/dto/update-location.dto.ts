import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateLocationDto {
  // ủeid: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  long: number;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  lat: number;
}
