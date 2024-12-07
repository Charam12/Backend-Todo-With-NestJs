// auth/guards/auth.guard.ts

import { Injectable } from '@nestjs/common';
import { CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthService } from '../auth/auth.service';  // ปรับ import ให้ถูกต้อง
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers['authorization'];

    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    if (!token.startsWith('Bearer ')) {
      throw new UnauthorizedException('Invalid token format');
    }

    const actualToken = token.split(' ')[1];

    try {
      const user = await this.authService.verifyToken(actualToken);
      request.user = user;
      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
