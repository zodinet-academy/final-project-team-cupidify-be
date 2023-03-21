import { DeleteUpdatePhotoDto } from './dto/delete-update-photo.dts';
import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { PhotoService } from './photo.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthenticationGuard } from '../auth/guards/auth.guard';
import { User } from '../user/decorator/user.decorator';
import { UserDto } from '../user/dto/user.dto';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { THttpResponse } from 'src/shared/common/http-response.dto';
import {
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common/decorators';

@Controller('photo')
export class PhotoController {
  constructor(private readonly _photoService: PhotoService) {}
  // @ApiBearerAuth()
  // @UseGuards(AuthenticationGuard)
  // @Get()
  // getPhotos(@User() user: UserDto) {
  //   return this._photoService.findOne(user.id);
  // }

  @ApiBearerAuth()
  @UseGuards(AuthenticationGuard)
  @Get()
  async getPhotoByUserId(@User() user: UserDto) {
    return this._photoService.getPhotoByUserId(user);
  }

  @ApiBearerAuth()
  @UseGuards(AuthenticationGuard)
  @Post('upload-images')
  @UseInterceptors(FilesInterceptor('files'))
  async uploadImages(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @User() user: UserDto,
    // @Param('id') userId: string,
  ): Promise<THttpResponse<string[]>> {
    const { id } = user;
    return this._photoService.uploadImages(files, id);
  }

  // @Put('update-images')
  // @UseInterceptors(FileInterceptor('files'))
  // async updateImage(
  //   @UploadedFile() file: Express.Multer.File,
  //   @Body() updateReq: DeleteUpdatePhotoDto,
  // ) {
  //   return this._photoService.updateImage(file, updateReq);
  // }
}
