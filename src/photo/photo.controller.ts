import {
  Controller,
  Param,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { PhotoService } from './photo.service';
import { THttpResponse } from 'src/shared/common/http-response.dto';

@Controller('photo')
export class PhotoController {
  constructor(private readonly _photoService: PhotoService) {}

  @Post('upload-images/:id')
  @UseInterceptors(FilesInterceptor('files'))
  async uploadImages(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Param('id') userId: string,
  ): Promise<THttpResponse<string[]>> {
    return this._photoService.uploadImages(files, userId);
  }
}
