import { THttpResponse } from './../../shared/common/http-response.dto';
import { Injectable, HttpStatus, BadRequestException } from '@nestjs/common';
import { UploadApiErrorResponse, UploadApiResponse, v2 } from 'cloudinary';
import toStream = require('buffer-to-stream');
import { ICloudinaryData } from '../../shared/interfaces/cloudinary.interface';

@Injectable()
export class CloudinaryUtilService {
  async uploadImages(
    files: Array<Express.Multer.File>,
  ): Promise<THttpResponse<ICloudinaryData[]>> {
    try {
      const result = await Promise.all(
        files.map((f) => this.uploadSingleImg(f)),
      );

      return {
        statusCode: HttpStatus.CREATED,
        data: result.map((i) => {
          return {
            publicId: i.public_id,
            photoUrl: i.url,
          };
        }),
      };
    } catch (err) {
      throw new BadRequestException('Upload failed');
    }
  }

  uploadSingleImg(
    file: Express.Multer.File,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return new Promise((resolve, reject) => {
      const upload = v2.uploader.upload_stream((error, result) => {
        if (error) return reject(error);
        resolve(result);
      });

      toStream(file.buffer).pipe(upload);
    });
  }

  deleteImg(
    public_id: string,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return new Promise(() => {
      const result = v2.uploader.destroy(public_id, {
        resource_type: 'image',
      });

      console.log('Deleted in Cloudinary');
    });
  }

  // updateImg(
  //   publicId: string,
  //   file: Express.Multer.File,
  // ): Promise<UploadApiResponse | UploadApiErrorResponse> {
  //   return new Promise(() => {
  //     console.log('Public Id: ', publicId);
  //     const update = v2.uploader.explicit(publicId, {
  //       type: 'private',
  //       invalidate: true,
  //     }).then(() => {
  //       console.log("Success")
  //     });
  //     console.log('Updated in Cloudinary');
  //   });
  // }
}
