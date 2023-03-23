import { PhotoProfile } from './photo.profile';
import { CloudinaryModule } from './../cloudinary/cloudinary.module';
import { Module } from '@nestjs/common';
import { PhotoService } from './photo.service';
import { PhotoController } from './photo.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Photo } from './entities/photo.entity';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Photo]), CloudinaryModule, UserModule],
  controllers: [PhotoController],
  providers: [PhotoService, PhotoProfile],
  exports: [PhotoService],
})
export class PhotoModule {}
