import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { CheckPhoneDto } from './dto/check-phone.dto';
import { CheckSocialDto } from './dto/check-social.dto';
import { SignUpDto } from './dto/sign-up.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async checkPhoneExist(checkPhoneDto: CheckPhoneDto) {
    const { phone } = checkPhoneDto;

    try {
      const user = await this.userRepository.findOne({ where: { phone } });

      if (!user) {
        return false;
      }
      return;
    } catch (err) {
      throw err;
    }
  }

  async checkSocialExist(checkSocialDto: CheckSocialDto) {
    const { socialId } = checkSocialDto;

    try {
      const user = await this.userRepository.findOne({ where: { socialId } });

      if (!user) {
        return false;
      }
      return user.phone;
    } catch (err) {
      throw err;
    }
  }

  async signUp(signUpDto: SignUpDto) {
    try {
      await this.userRepository.save(signUpDto);
    } catch (err) {
      throw err;
    }
  }
}
