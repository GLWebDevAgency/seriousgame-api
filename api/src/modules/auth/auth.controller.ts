import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('signup')
  signup(@Body() signupDto: SignupDto) {
    return this.auth.signup(
      signupDto.email,
      signupDto.password,
      signupDto.nickname,
    );
  }

  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.auth.login(loginDto.email, loginDto.password);
  }
}
