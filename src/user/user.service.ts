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

  async isPhoneExist(phone: string): Promise<string> {
    try {
      console.log(phone);
      console.log(this._user);
      // const result = await this._userEntity.findOne({ where: { phone } });
      const result = await this._user.find();
      console.log(result);

      // console.log('Result:', result.id);
      if (!result) return 'false';

      return;
    } catch (err) {
      console.log('Error');
      throw new BadRequestException(err.message);
    }
  }

  async isSocialExist(socialId: string): Promise<string> {
    try {
      const user = await this._user.findOne({ where: { socialId } });

      if (!user) {
        return 'Invalid social ID';
      }

      return user.phone;
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }
}
