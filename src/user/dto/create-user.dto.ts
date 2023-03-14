import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';

export class CreateUserDto {
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
}
