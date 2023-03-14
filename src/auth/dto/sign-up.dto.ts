import {
  IsDate,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';
import { Gender } from '../../shared/enums/index';
import { Type } from 'class-transformer';

export class SignUpDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/(((\+|)84)|0)(3|5|7|8|9)+([0-9]{8})\b/)
  phone: string;

  @IsOptional()
  @IsString()
  socialId: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  birthday: Date;

  @IsEnum(Gender)
  gender: Gender;
}
