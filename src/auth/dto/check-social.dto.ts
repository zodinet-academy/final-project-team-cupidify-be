import { IsString } from 'class-validator';

export class CheckSocialDto {
  @IsString()
  socialId: string;
}
