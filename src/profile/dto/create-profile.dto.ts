import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsString,
  MaxLength,
} from 'class-validator';
import { Gender } from 'src/shared/enums';

export class CreateProfileDto {
  @AutoMap()
  @ApiProperty({
    default: 'dd5ef115-3049-433e-9f43-c9b75b7afc13',
    type: String,
  })
  userId: string;

  @AutoMap()
  @ApiProperty({
    default: 'Jonas Schmedtmann',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @AutoMap()
  @ApiProperty({
    default: Gender.MALE,
    type: String,
  })
  @IsEnum(Gender)
  gender: Gender;

  @AutoMap()
  @ApiProperty({
    default: '2001-11-16',
    type: String,
  })
  @IsDateString()
  birthday: string;
}
