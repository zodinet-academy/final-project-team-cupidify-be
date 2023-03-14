import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CheckPhoneDto } from './dto/check-phone.dto';
import { SignUpDto } from './dto/sign-up.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('check-phone-exist')
  checkPhoneExist(@Body() checkPhoneDto: CheckPhoneDto) {
    return this.authService.checkPhoneExist(checkPhoneDto);
  }

  @Post('signup')
  signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }
}
