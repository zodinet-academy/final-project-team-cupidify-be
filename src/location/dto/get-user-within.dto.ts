import { IsNotEmpty, IsNumber } from 'class-validator';

export class GetUserWithinDto {
  @IsNumber()
  @IsNotEmpty()
  range: number;
}
