import { IsNotEmpty } from 'class-validator';

export class AddBlockedUserDto {
  @IsNotEmpty()
  blockedId: string;
}
