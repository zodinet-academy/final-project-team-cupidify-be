import { UserDto } from './../user/dto/user.dto';
import { THttpResponse } from './../shared/common/http-response.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CloudinaryService } from './../cloudinary/cloudinary.service';
import {
  Injectable,
  BadRequestException,
  HttpStatus,
  UploadedFiles,
  UploadedFile,
} from '@nestjs/common';
import { Photo } from './entities/photo.entity';
import { Repository } from 'typeorm';
import { ICloudinaryData } from '../shared/interfaces/cloudinary.interface';
import { PhotoDto } from './dto/photo.dto';

@Injectable()
export class PhotoService {
  constructor(
    @InjectRepository(Photo)
    private readonly _photo: Repository<Photo>,
    private readonly _cloudinaryService: CloudinaryService,
  ) {}

  async getPhotoByUserId(user: UserDto): Promise<THttpResponse<PhotoDto[]>> {
    try {
      const { id } = user;
      const result = await this._photo.find({ where: { userId: id } });

      console.log(result);

      return {
        statusCode: HttpStatus.OK,
        data: result,
      };
    } catch (err) {
      throw new BadRequestException(HttpStatus.BAD_REQUEST, err.message);
    }
  }

  async uploadImages(
    @UploadedFiles() files: Array<Express.Multer.File>,
    userId: string,
  ): Promise<THttpResponse<void>> {
    try {
      const result = await this._cloudinaryService.uploadImagesToCloudinary(
        files,
      );

      console.log(result);

      await this.storeImages(userId, result.data);

      return {
        statusCode: HttpStatus.CREATED,
        message: 'Uploaded',
      };
    } catch (err) {
      console.log(err.message);
      throw new BadRequestException(
        HttpStatus.BAD_REQUEST,
        'Upload images failed',
      );
    }
  }

  async storeImages(userId: string, images: ICloudinaryData[]) {
    try {
      for (let i = 0; i < images.length; i++) {
        await this._photo.save({
          userId,
          photoUrl: images[i].photoUrl,
          publicId: images[i].publicId,
          isFavorite: false,
        });
      }
    } catch (err) {
      // store url failed => delete in cloudinary
      console.log('Store failed');
      images.map(async (i) => {
        await this._cloudinaryService.deleteImagesInCloudinary(i.publicId);
      });

      throw new BadRequestException(
        HttpStatus.FAILED_DEPENDENCY,
        'Store photo failed',
      );
    }
  }

  async deleteImage(userId, publicId): Promise<THttpResponse<void>> {
    try {
      // const { userId, publicId } = deleteReq;

      await this._photo.delete({
        userId,
        publicId,
      });

      await this._cloudinaryService.deleteImagesInCloudinary(publicId);

      return {
        statusCode: HttpStatus.NO_CONTENT,
        message: 'Deleted',
      };
    } catch (err) {
      throw new BadRequestException(HttpStatus.BAD_REQUEST, 'Delete Failed');
    }
  }

  async updateImage(
    @UploadedFile() file: Express.Multer.File,
    userId: string,
    publicId: string,
  ): Promise<THttpResponse<void>> {
    try {
      await this._photo.delete({ publicId });

      await this._cloudinaryService.updateImagesInCloudinary(publicId, file);

      return {
        statusCode: HttpStatus.NO_CONTENT,
        message: 'Updated',
      };
    } catch (err) {
      throw new BadRequestException(
        HttpStatus.BAD_REQUEST,
        'Update image failed',
      );
    }
  }

  async updateFavorite(userId, publicId): Promise<THttpResponse<void>> {
    try {
      await this._photo.update(
        {
          isFavorite: true,
        },
        {
          userId,
          publicId,
        },
      );

      return {
        statusCode: HttpStatus.NO_CONTENT,
        message: 'Updated favorite',
      };
    } catch (err) {
      throw new BadRequestException(
        HttpStatus.BAD_REQUEST,
        'Update favorite failed',
      );
    }
  }
}
