import { Mapper } from '@automapper/core';
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
import { UserService } from 'src/user/user.service';
import { InjectMapper } from '@automapper/nestjs';
import { UploadPhotoDto } from './dto/upload-photo.dto';

@Injectable()
export class PhotoService {
  constructor(
    @InjectRepository(Photo)
    private readonly _photo: Repository<Photo>,
    @InjectMapper() private readonly _classMapper: Mapper,
    private readonly _cloudinaryService: CloudinaryService,
    private readonly _userService: UserService,
  ) {}

  async getUserPhoto(
    userId: string,
  ): Promise<THttpResponse<PhotoDto | PhotoDto[]>> {
    try {
      const checkUserExist = await this._userService.isUserExist(userId);

      if (!checkUserExist) {
        throw new BadRequestException(HttpStatus.NOT_FOUND, 'User Not Found');
      }

      const res = await this._photo.find({ where: { userId } });

      const result = await this._classMapper.mapArrayAsync(
        res,
        Photo,
        PhotoDto,
      );

      return {
        statusCode: HttpStatus.OK,
        data: result,
      };
    } catch (err) {
      throw new BadRequestException(HttpStatus.NOT_FOUND, 'User Not Found');
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

      const photos = result.data.map((el) => ({
        ...el,
        userId,
        isFavorite: false,
      }));

      await this.storeImages(userId, photos);

      return {
        statusCode: HttpStatus.CREATED,
        message: 'Uploaded',
      };
    } catch (err) {
      throw new BadRequestException(
        HttpStatus.BAD_REQUEST,
        'Upload images failed',
      );
    }
  }

  async storeImages(userId: string, photos: UploadPhotoDto[]): Promise<void> {
    try {
      const resources = this._classMapper.mapArray(
        photos,
        UploadPhotoDto,
        Photo,
      );

      await this._photo.save(resources);
    } catch (err) {
      throw new BadRequestException(
        HttpStatus.FAILED_DEPENDENCY,
        'Store photo failed',
      );
    }
  }

  async deleteImage(
    userId: string,
    publicId: string,
  ): Promise<THttpResponse<void>> {
    try {
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
