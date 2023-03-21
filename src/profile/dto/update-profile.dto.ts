import { PartialType } from '@nestjs/mapped-types';
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
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @IsOptional()
  @IsEnum(Gender)
  gender: Gender;

  @IsOptional()
  @IsEnum(Reason)
  reason: Reason;

  @IsOptional()
  @IsDateString()
  birthday: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  @IsNotEmpty()
  description?: string;

  @IsOptional()
  @IsNotEmpty()
  height?: number;

  @IsOptional()
  @IsEnum(Religion)
  religion?: Religion;

  @IsOptional()
  @IsBoolean()
  drinking?: boolean;

  @IsOptional()
  @IsEnum(Education)
  education?: Education;

  @IsOptional()
  @IsBoolean()
  haveChildren?: boolean;

  @IsOptional()
  interests?: string[];
}
