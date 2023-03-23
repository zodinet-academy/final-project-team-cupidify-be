import { ApiProperty } from '@nestjs/swagger';

export class PhotoDto {
  @ApiProperty({
    default: 'dd5ef115-3049-433e-9f43-c9b75b7afc13',
    type: String,
  })
  id: string;

  @ApiProperty({
    default: 'relzdbarsgbpoqt2ekal',
    type: String,
  })
  publicId: string;

  @ApiProperty({
    default:
      'http://res.cloudinary.com/dtra2soty/image/upload/v1679461059/relzdbarsgbpoqt2ekal.png',
    type: String,
  })
  photoUrl: string;
}
