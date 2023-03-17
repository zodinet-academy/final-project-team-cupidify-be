import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { Profile } from './entities/profile.entity';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(Profile)
    private readonly _profile: Repository<Profile>,
  ) {}

  async create(createProfileDto: CreateProfileDto) {
    try {
      const profile = await this._profile.create(createProfileDto);
      return profile;
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async save(createProfileDto: CreateProfileDto) {
    try {
      const profile = await this._profile.save(createProfileDto);
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

  update(id: number, updateProfileDto: UpdateProfileDto) {
    return `This action updates a #${id} profile`;
  }

  remove(id: number) {
    return `This action removes a #${id} profile`;
  }
}
