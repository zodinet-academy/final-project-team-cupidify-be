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

dotenv.config();

@Injectable()
export class AuthService {
  constructor(
    private readonly _userService: UserService,
    private readonly _jwtService: JwtService,
  ) {}

  generateToken(payload): string {
    const token = this._jwtService.sign(payload);
    return token;
  }

  async signUp(signUpDto: SignUpDto): Promise<AuthDto> {
    try {
      const user = await this._userService.createUser(signUpDto);

      const token = this._jwtService.sign(user, {
        secret: process.env.SECRET_KEY,
        expiresIn: process.env.EXPIRES_IN,
      });

      return {
        token,
      };
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

      console.log(userPayload);

      const token = this._jwtService.sign(userPayload, {
        secret: process.env.SECRET_KEY,
        expiresIn: process.env.EXPIRES_IN,
      });

      return {
        token,
      };
    } catch (err) {
      throw new BadRequestException('Login Failed');
    }
  }
}
