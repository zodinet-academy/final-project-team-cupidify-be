import { THttpResponse } from './../shared/common/http-response.dto';
import { CloudinaryService } from './../cloudinary/cloudinary.service';
import {
  Injectable,
  BadRequestException,
  HttpStatus,
  UploadedFiles,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Photo } from './entities/photo.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PhotoService {
  constructor(
    @InjectRepository(Photo)
    private readonly _photo: Repository<Photo>,
    private readonly _cloudinaryService: CloudinaryService,
  ) {}

  async uploadImages(
    @UploadedFiles() files: Array<Express.Multer.File>,
    userId: string,
  ): Promise<any> {
    try {
      const result = await this._cloudinaryService.uploadImagesToCloudinary(
        files,
      );

      await this.storeImages(userId, result.data);
    } catch (err) {
      console.log(err.message);
      throw new BadRequestException(
        HttpStatus.BAD_REQUEST,
        'Upload images failed',
      );
    }
  }

  async storeImages(userId: string, imageUrls: string[]) {
    for (let i = 0; i < imageUrls.length; i++) {
      await this._photo.save({
        userId,
        photoUrl: imageUrls[i],
        isFavorite: false,
      });
    }
  }
}
