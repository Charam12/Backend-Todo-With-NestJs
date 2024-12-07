import { Injectable, UnauthorizedException, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
  private readonly prisma = new PrismaClient();
  private readonly jwtSecret = process.env.JWT_SECRET;

  async register(username: string, password: string, displayName: string): Promise<any> {
    const hashedPassword = await bcrypt.hash(password, 10);
    const findUser = await this.prisma.user.findUnique({ where: { username: username } });
    if (findUser) {
        throw new HttpException('Username already exists', HttpStatus.BAD_REQUEST);
    }
    const user = await this.prisma.user.create({
      data: { username: username, password: hashedPassword, display_name: displayName },
    });
    return { id: user.id, username: user.username };
  }

  async login(username: string, password: string): Promise<string> {
    const user = await this.prisma.user.findUnique({ where: { username } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload = { userId: user.id };
    return jwt.sign(payload, this.jwtSecret, { expiresIn: '1h' });
  }

  async verifyToken(token: string): Promise<any> {
    try {
      return jwt.verify(token, this.jwtSecret);
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
