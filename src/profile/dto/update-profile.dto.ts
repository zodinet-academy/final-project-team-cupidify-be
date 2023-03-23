import { PartialType } from '@nestjs/mapped-types';
import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { Education, Gender, Reason, Religion } from 'src/shared/enums';
import { CreateProfileDto } from './create-profile.dto';

export class UpdateProfileDto extends PartialType(CreateProfileDto) {
  @ApiPropertyOptional({
    default: 'Jonas Schmedtmann',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @ApiPropertyOptional({
    default: Gender.MALE,
    type: String,
  })
  @IsOptional()
  @IsEnum(Gender)
  gender: Gender;

  @ApiPropertyOptional({
    default: Reason.DATE,
    type: String,
  })
  @IsOptional()
  @IsEnum(Reason)
  reason: Reason;

  @ApiPropertyOptional({
    default: '2001-11-16',
    type: String,
  })
  @IsOptional()
  @IsDateString()
  birthday: string;

  @ApiPropertyOptional({
    default: 'Anh đẹp trai nhưng chưa có ngừi eo',
    type: String,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  @IsNotEmpty()
  description?: string;

  @ApiPropertyOptional({
    default: 180,
    type: Number,
  })
  @IsOptional()
  @IsNotEmpty()
  height?: number;

  @ApiPropertyOptional({
    default: Religion.CHRISTIAN,
    type: String,
  })
  @IsOptional()
  @IsEnum(Religion)
  religion?: Religion;

  @ApiPropertyOptional({
    default: true,
    type: Boolean,
  })
  @IsOptional()
  @IsBoolean()
  drinking?: boolean;

  @ApiPropertyOptional({
    default: Education.HIGH_SCHOOL,
    type: String,
  })
  @IsOptional()
  @IsEnum(Education)
  education?: Education;

  @ApiPropertyOptional({
    default: false,
    type: Boolean,
  })
  @IsOptional()
  @IsBoolean()
  haveChildren?: boolean;

  @ApiPropertyOptional({
    default: [],
    type: Array,
  })
  @IsOptional()
  interests?: string[];
}
