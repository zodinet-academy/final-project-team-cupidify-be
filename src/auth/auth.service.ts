import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { SignUpDto } from './dto/sign-up.dto';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UserService))
    private readonly _userService: UserService,
    private readonly _jwtService: JwtService,
  ) {}

  generateToken(payload): string {
    const token = this._jwtService.sign(payload);
    return token;
  }

  async signUp(signUpDto: SignUpDto): Promise<string> {
    try {
      const user = await this._userService.createUser(signUpDto);

      const token = this._jwtService.sign(user);

      return token;
    } catch (err) {
      throw err;
    }
  }
}
