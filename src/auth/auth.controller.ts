import { Controller, Post, Body, Get, Headers, HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() body: { username: string; password: string; displayName: string }) {
    return this.authService.register(body.username, body.password, body.displayName);
  }

  @Post('login')
  @HttpCode(200)
  async login(@Body() body: { username: string; password: string }) {
    return { access_token: await this.authService.login(body.username, body.password) };
  }
}
