import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateLocationDto {
  @IsNumber()
  @IsNotEmpty()
  long: number;

  @IsNumber()
  @IsNotEmpty()
  lat: number;
}
