import { Injectable, BadRequestException } from '@nestjs/common';
import { CloudinaryUtilService } from './utils/cloudinaryUtil.service';

@Injectable()
export class CloudinaryService {
  constructor(private _cloudinary: CloudinaryUtilService) {}
  async uploadImagesToCloudinary(files: Array<Express.Multer.File>) {
    return await this._cloudinary.uploadAllImg(files).catch((err) => {
      throw new BadRequestException(err.message);
    });
  }
}
