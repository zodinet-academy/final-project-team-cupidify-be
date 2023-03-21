import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { PhotoService } from './photo.service';
import { CreatePhotoDto } from './dto/create-photo.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthenticationGuard } from '../auth/guards/auth.guard';
import { User } from '../user/decorator/user.decorator';
import { UserDto } from '../user/dto/user.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { THttpResponse } from 'src/shared/common/http-response.dto';
import { UploadedFiles, UseInterceptors } from '@nestjs/common/decorators';

@Controller('photo')
export class PhotoController {
  constructor(private readonly _photoService: PhotoService) {}

  @Post()
  create(@Body() createPhotoDto: CreatePhotoDto) {
    return this._photoService.create(createPhotoDto);
  }

  // @Get()
  // findAll() {
  //   return this._photoService.findAll();
  // }

  @ApiBearerAuth()
  @UseGuards(AuthenticationGuard)
  @Get()
  getPhotos(@User() user: UserDto) {
    return this._photoService.findOne(user.id);
  }

  @Post('upload-images/:id')
  @UseInterceptors(FilesInterceptor('files'))
  async uploadImages(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Param('id') userId: string,
  ): Promise<THttpResponse<string[]>> {
    return this._photoService.uploadImages(files, userId);
  }
}
