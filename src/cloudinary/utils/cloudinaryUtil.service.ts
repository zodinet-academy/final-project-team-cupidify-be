import { Injectable } from '@nestjs/common';
import { v2 } from 'cloudinary';
import toStream = require('buffer-to-stream');

@Injectable()
export class CloudinaryUtilService {
  async uploadAllImg(files: Array<Express.Multer.File>): Promise<any> {
    const result = await Promise.all(files.map((f) => this.uploadSingleImg(f)));

    return result;
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
