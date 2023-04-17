import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class FindNotiDto {
  @ApiProperty({
    type: String,
    title: 'Last notification ID',
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  lastNotiId: string;
}
