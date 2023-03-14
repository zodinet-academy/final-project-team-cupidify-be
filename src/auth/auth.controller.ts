import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/sign-up.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly _authService: AuthService) {}

  // @Post('check-phone-exist')
  // checkPhoneExist(@Body() checkPhoneDto: CheckPhoneDto) {
  //   return this._authService.isPhoneExist(checkPhoneDto);
  // }

  @Post('signup')
  signUp(@Body() signUpDto: SignUpDto) {
    return this._authService.signUp(signUpDto);
  }
}
