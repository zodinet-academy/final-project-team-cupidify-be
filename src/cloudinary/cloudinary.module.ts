import { CloudinaryProvider } from './cloudinary.provider';
import { Module } from '@nestjs/common';
import { CloudinaryService } from './cloudinary.service';
import { CloudinaryController } from './cloudinary.controller';
import { CloudinaryUtilService } from './utils/cloudinaryUtil.service';

@Module({
  controllers: [CloudinaryController],
  providers: [CloudinaryService, CloudinaryUtilService, CloudinaryProvider],
  exports: [CloudinaryService, CloudinaryUtilService],
})
export class CloudinaryModule {}
