import { UserDto } from './../user/dto/user.dto';
import { THttpResponse } from './../shared/common/http-response.dto';
import { DeleteUpdatePhotoDto } from './dto/delete-update-photo.dts';
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

  async deleteImages(deleteReq: DeleteUpdatePhotoDto): Promise<void> {
    try {
      const { userId, publicId } = deleteReq;

      await this._photo.delete({
        userId,
        publicId,
      });

      await this._cloudinaryService.deleteImagesInCloudinary(publicId);
    } catch (err) {
      throw new BadRequestException(HttpStatus.BAD_REQUEST, 'Delete Failed');
    }
  }

  // async updateImage(
  //   @UploadedFile() file: Express.Multer.File,
  //   updateReq: DeleteUpdatePhotoDto,
  // ) {
  //   try {
  //     // const { userId, publicId } = updateReq;
  //     // console.log(userId, publicId, file);
  //     // await this._cloudinaryService.updateImagesInCloudinary(file, publicId);
  //     // console.log('Image Updated');
  //   } catch (err) {
  //     throw new BadRequestException(
  //       HttpStatus.BAD_REQUEST,
  //       'Update image failed',
  //     );
  //   }
  // }

  async updateFavorite(updateReq: DeleteUpdatePhotoDto): Promise<void> {
    try {
      const { userId, publicId } = updateReq;

      await this._photo.update(
        {
          isFavorite: true,
        },
        {
          userId,
          publicId,
        },
      );
    } catch (err) {
      throw new BadRequestException(
        HttpStatus.BAD_REQUEST,
        'Update favorite failed',
      );
    }
  }
}
