import { THttpResponse } from './../../shared/common/http-response.dto';
import { Injectable, HttpStatus, BadRequestException } from '@nestjs/common';
import { v2 } from 'cloudinary';
import toStream = require('buffer-to-stream');

@Injectable()
export class CloudinaryUtilService {
  async uploadImages(
    files: Array<Express.Multer.File>,
  ): Promise<THttpResponse<string[]>> {
    try {
      const result = await Promise.all(
        files.map((f) => this.uploadSingleImg(f)),
      );

      return {
        statusCode: HttpStatus.CREATED,
        data: result.map((i) => {
          return i.url;
        }),
      };
    } catch (err) {
      throw new BadRequestException('Upload failed');
    }
  }

  uploadSingleImg(file: Express.Multer.File): Promise<any> {
    return new Promise((resolve, reject) => {
      const upload = v2.uploader.upload_stream((error, result) => {
        if (error) return reject(error);
        resolve(result);
      });

      toStream(file.buffer).pipe(upload);
    });
  }
}
