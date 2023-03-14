import {
  HttpException,
  HttpStatus,
  Injectable,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { SignUpDto } from './dto/sign-up.dto';
import { UserService } from 'src/user/user.service';
import { AuthDto } from './dto/auth.dto';
import * as dotenv from 'dotenv';
import { ProfileService } from 'src/profile/profile.service';
import IUserPayload from './interfaces/user-payload.interface';

dotenv.config();

@Injectable()
export class AuthService {
  constructor(
    private readonly _userService: UserService,
    private readonly _jwtService: JwtService,
    private readonly _profileService: ProfileService,
  ) {}

  async signUp(signUpDto: SignUpDto): Promise<AuthDto> {
    const { phone, email, socialId, gender, name, birthday } = signUpDto;

    try {
      const createdUser = await this._userService.createUser({
        phone,
        email,
        socialId,
      });

      const createdProfile = await this._profileService.create({
        user: createdUser,
        name,
        birthday,
        gender,
      });

      if (!createdUser || !createdProfile) {
        throw new HttpException(
          'Please input valid information',
          HttpStatus.BAD_REQUEST,
        );
      }

      const [user, profile] = await Promise.all([
        this._userService.saveUser(createdUser),
        this._profileService.save({
          user: createdUser,
          name,
          birthday,
          gender,
        }),
      ]);

      const token = this.signToken({
        id: user.id,
        phone: user.phone,
        email: user.email,
      });

      return { token };
    } catch (err) {
      throw err;
    }
  }

  async login(phone: string): Promise<AuthDto> {
    try {
      const user = await this._userService.isPhoneExist(phone);

      if (!user.checked)
        throw new HttpException('Wrong Credentials', HttpStatus.NOT_FOUND);

      const userPayload = {
        id: user.data.id,
        phone: user.data.phone,
        email: user.data.email,
      };

      const token = this.signToken(userPayload);

      return {
        token,
      };
    } catch (err) {
      throw new BadRequestException('Login Failed');
    }
  }

  signToken(userPayload: IUserPayload): string {
    const token = this._jwtService.sign(userPayload, {
      secret: process.env.SECRET_KEY,
      expiresIn: process.env.EXPIRES_IN,
    });

    return token;
  }
}
