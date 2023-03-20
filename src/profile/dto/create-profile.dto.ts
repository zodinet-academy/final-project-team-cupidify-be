import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { Education, Gender, Religion } from 'src/shared/enums';
import { UserDto } from '../../user/dto/user.dto';

export class CreateProfileDto {
  userId: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @IsEnum(Gender)
  gender: Gender;

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
