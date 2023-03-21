import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { PhotoService } from './photo.service';
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

  @ApiBearerAuth()
  @UseGuards(AuthenticationGuard)
  @Get()
  async getPhotoByUserId(@User() user: UserDto) {
    return this._photoService.getPhotoByUserId(user);
  }

  @ApiBearerAuth()
  @UseGuards(AuthenticationGuard)
  @Post()
  @UseInterceptors(FilesInterceptor('files'))
  async uploadImages(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @User() user: UserDto,
    // @Param('id') userId: string,
  ): Promise<THttpResponse<string[]>> {
    const { id } = user;
    return this._photoService.uploadImages(files, id);
  }

  @ApiBearerAuth()
  @UseGuards(AuthenticationGuard)
  @Delete(':id')
  async deleteImages(@User() user: UserDto, @Param('id') publicId: string) {
    const { id } = user;
    return this._photoService.deleteImages(id, publicId);
  }

  @ApiBearerAuth()
  @UseGuards(AuthenticationGuard)
  @Put('favorite')
  async updateFavorite(@User() user: UserDto, @Param('id') publicId: string) {
    const { id } = user;
    return this._photoService.updateFavorite(id, publicId);
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
