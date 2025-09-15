import { Body, Controller, Post, UseFilters } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/request/register.dto';
import { LoginDto } from './dto/request/login.dto';
import { ValidationToUnauthorizedFilter } from './validation-to-unauthorized.filter';

@Controller('auth')
export class AuthController {
  constructor(private auth: AuthService) {}

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.auth.register(dto);
  }

  @Post('login')
  @UseFilters(new ValidationToUnauthorizedFilter())
  login(@Body() dto: LoginDto) {
    return this.auth.login(dto);
  }
}
