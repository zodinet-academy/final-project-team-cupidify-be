import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Req,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/sign-up.dto';
import { FirebaseTokenDto } from './dto/firebase-token.dto';
import { LogInDto } from './dto/log-in.dto';
import { AuthGuard } from '@nestjs/passport';
import { GoogleTokenDto } from './dto/gg-token.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly _authService: AuthService) {}

  @Post('signup')
  signUp(@Body() signUpDto: SignUpDto) {
    return this._authService.signUp(signUpDto);
  }

  @Post('login')
  login(@Body() logInDto: LogInDto) {
    return this._authService.login(logInDto);
  }

  @Post('verify-otp-token')
  verifyOtpToken(@Body() firebaseTokenDto: FirebaseTokenDto) {
    return this._authService.verifyFirebaseToken(firebaseTokenDto.token);
  }

  @Post('verify-gg-token')
  verifyGgToken(@Body() ggTokenDto: GoogleTokenDto) {
    return this._authService.verifyGgToken(ggTokenDto.token);
  }
}
