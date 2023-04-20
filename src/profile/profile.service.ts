import { THttpResponse } from './../shared/common/http-response.dto';
import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { Profile } from './entities/profile.entity';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { ProfileDto } from './dto/profile.dto';
import { IConversationProfile } from './interfaces';
import { ProfileConversationDto } from './dto/profile-conversation.dto';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(Profile)
    private readonly _profileRepository: Repository<Profile>,
    @InjectMapper() private readonly _classMapper: Mapper,
    private _dataSource: DataSource,
  ) {}

  async create(createProfileDto: CreateProfileDto) {
    try {
      const profile = await this._profileRepository.create(createProfileDto);
      return profile;
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async save(createProfileDto: CreateProfileDto): Promise<ProfileDto> {
    try {
      const toSaveDto = this._classMapper.map(
        createProfileDto,
        CreateProfileDto,
        Profile,
      );
      const profile = this._classMapper.mapAsync(
        await this._profileRepository.save(toSaveDto),
        Profile,
        ProfileDto,
      );
      return profile;
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async findOneByUserId(userId: string): Promise<THttpResponse<ProfileDto>> {
    try {
      const result = await this._classMapper.mapAsync(
        await this._profileRepository.findOne({
          where: { userId },
        }),
        Profile,
        ProfileDto,
      );

      return {
        statusCode: HttpStatus.OK,
        data: result,
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
      await this._profileRepository.update({ userId }, updateProfileDto);

      return {
        statusCode: HttpStatus.NO_CONTENT,
      };
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async getConversationProfile(otherUserIds: IConversationProfile[]) {
    try {
      const profiles = await this._dataSource.manager
        .createQueryBuilder(Profile, 'pro')
        .where('pro.userId IN (:...userIds)', {
          userIds: otherUserIds.map((u) => u.userId),
        })
        .getMany();

      if (profiles.length === 0) {
        throw new NotFoundException('Not Found Conversations');
      }

      const mapProfile = await this._classMapper.mapArrayAsync(
        profiles,
        Profile,
        ProfileConversationDto,
      );

      return mapProfile;
    } catch (err) {
      throw new BadRequestException('Error Get Conversation Profiles');
    }
  }
}
