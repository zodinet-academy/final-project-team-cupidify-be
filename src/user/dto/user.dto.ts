/* eslint-disable prettier/prettier */
import { ApiProperty } from "@nestjs/swagger";

export class UserDto {
  @ApiProperty({default: "dfgdsg5435", type: String})
  id: string;

  @ApiProperty({default: "Trong Phan", type: String})
  name: string;

  @ApiProperty({default: "423423443", type: String})
  phone: string;

  @ApiProperty({default: "2023-01-23", type: Date})
  birthday: Date;
}
