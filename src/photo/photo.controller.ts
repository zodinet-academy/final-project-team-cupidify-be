import { PhotoDto } from './dto/photo.dto';
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
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthenticationGuard } from '../auth/guards/auth.guard';
import { User } from '../user/decorator/user.decorator';
import { UserDto } from '../user/dto/user.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { THttpResponse } from 'src/shared/common/http-response.dto';
import { UploadedFiles, UseInterceptors } from '@nestjs/common/decorators';

@ApiTags('photo')
@Controller('photo')
export class PhotoController {
  constructor(private readonly _photoService: PhotoService) {}

  @ApiOkResponse({
    description: 'Get user photo URLs',
    type: PhotoDto,
  })
  @ApiBearerAuth()
  @UseGuards(AuthenticationGuard)
  @Get()
  async getUserPhoto(
    @User() user: UserDto,
  ): Promise<THttpResponse<PhotoDto | PhotoDto[]>> {
    const { id } = user;
    return this._photoService.getUserPhoto(id);
  }

  @ApiOkResponse({
    description: 'Get photo URLs by userId',
    type: PhotoDto,
  })
  @ApiBearerAuth()
  @UseGuards(AuthenticationGuard)
  @Get(':id')
  async getPhotoByUser(
    @Param('id') userId: string,
  ): Promise<THttpResponse<PhotoDto | PhotoDto[]>> {
    return this._photoService.getUserPhoto(userId);
  }

  @ApiCreatedResponse({
    description: 'Uploaded',
  })
  @ApiBearerAuth()
  @UseGuards(AuthenticationGuard)
  @Post()
  @UseInterceptors(FilesInterceptor('files'))
  async uploadImages(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @User() user: UserDto,
  ): Promise<THttpResponse<void>> {
    const { id } = user;
    return this._photoService.uploadImages(files, id);
  }

  @ApiNoContentResponse({
    description: 'Deleted',
  })
  @ApiBearerAuth()
  @UseGuards(AuthenticationGuard)
  @Delete(':id')
  async deleteImage(
    @User() user: UserDto,
    @Param('id') publicId: string,
  ): Promise<THttpResponse<void>> {
    const { id } = user;
    return this._photoService.deleteImage(id, publicId);
  }

  @ApiNoContentResponse({
    description: 'Updated favorite',
  })
  @ApiBearerAuth()
  @UseGuards(AuthenticationGuard)
  @Put('favorite')
  async updateFavorite(
    @User() user: UserDto,
    @Param('id') publicId: string,
  ): Promise<THttpResponse<void>> {
    const { id } = user;
    return this._photoService.updateFavorite(id, publicId);
  }
}
