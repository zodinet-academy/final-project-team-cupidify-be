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

  findAll() {
    return `This action returns all profile`;
  }

  findOne(id: number) {
    return `This action returns a #${id} profile`;
  }

  async findOneByUserId(userId: string): Promise<Profile> {
    try {
      const profile = await this._profileRepository.findOne({
        where: { userId },
      });

      if (!profile)
        throw new HttpException(
          'No profile found with that id!',
          HttpStatus.NOT_FOUND,
        );

      return profile;
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async update(userId: string, updateProfileDto: UpdateProfileDto) {
    try {
      const profile = await this.findOneByUserId(userId);

      const updatedProfile = Object.assign(profile, updateProfileDto);

      return await this._profileRepository.save(updatedProfile);
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  remove(id: number) {
    return `This action removes a #${id} profile`;
  }
}
