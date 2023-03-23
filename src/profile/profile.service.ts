import { THttpResponse } from './../shared/common/http-response.dto';
import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { Profile } from './entities/profile.entity';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(Profile)
    private readonly _profileRepository: Repository<Profile>,
  ) {}

  async create(createProfileDto: CreateProfileDto) {
    try {
      const profile = await this._profileRepository.create(createProfileDto);
      return profile;
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async save(createProfileDto: CreateProfileDto) {
    try {
      const profile = await this._profileRepository.save(createProfileDto);
      return profile;
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async findOneByUserId(userId: string): Promise<THttpResponse<Profile>> {
    try {
      const profile = await this._profileRepository.findOne({
        where: { userId },
      });

      if (!profile) {
        throw new HttpException(
          'No profile found with that id!',
          HttpStatus.NOT_FOUND,
        );
      }

      return {
        statusCode: HttpStatus.OK,
        data: profile,
      };
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async update(
    userId: string,
    updateProfileDto: UpdateProfileDto,
  ): Promise<THttpResponse<void>> {
    try {
      const profile = await this.findOneByUserId(userId);

      const updatedProfile = Object.assign(profile.data, updateProfileDto);

      await this._profileRepository.save(updatedProfile);

      return {
        statusCode: HttpStatus.NO_CONTENT,
      };
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }
}
