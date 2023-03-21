import { Injectable, BadRequestException } from '@nestjs/common';
import { CloudinaryUtilService } from './utils/cloudinaryUtil.service';

@Injectable()
export class CloudinaryService {
  constructor(private _cloudinary: CloudinaryUtilService) {}
  async uploadImagesToCloudinary(files: Array<Express.Multer.File>) {
    return await this._cloudinary.uploadImages(files).catch((err) => {
      throw new BadRequestException(err.message);
    });
  }

  async deleteImagesInCloudinary(publicId: string) {
    return await this._cloudinary.deleteImg(publicId).catch((err) => {
      throw new BadRequestException(err.message);
    });
  }

  // async updateImagesInCloudinary(file: Express.Multer.File, publicId: string) {
  //   return await this._cloudinary.updateImg(publicId, file).catch((err) => {
  //     throw new BadRequestException(err.message);
  //   });
  // }
}
