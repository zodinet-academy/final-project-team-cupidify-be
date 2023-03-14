import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { UserDto } from './dto/user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly _user: Repository<User>,
  ) {}

  async createUser(createUser: CreateUserDto): Promise<UserDto> {
    try {
      const result = await this._user.save(createUser);

      return result;
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async isPhoneExist(phone: string): Promise<boolean> {
    try {
      const result = await this._user.findOne({ where: { phone } });

      if (!result) return false;

      return;
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async isSocialExist(socialId: string): Promise<{ phone: string }> {
    try {
      const user = await this._user.findOne({ where: { socialId } });

      if (!user) {
        return;
      }

      return {
        phone: user.phone,
      };
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }
}
