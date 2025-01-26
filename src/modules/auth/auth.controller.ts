import { Controller, Get, Headers } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiHeader } from '@nestjs/swagger';

@Controller('')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('userValidation')
  @ApiHeader({
    name: 'token',
    description: 'Token de Google',
    required: true,
  })
  userValidation(@Headers('token') token) {
    return this.authService.validateUser(token);
  }
}
