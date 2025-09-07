import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwt: JwtService,
    private readonly cfg: ConfigService,
  ) {}

  async signup(email: string, password: string, nickname: string) {
    const existing = await this.usersService.findByEmail(email);
    if (existing) throw new BadRequestException('Email already in use');

    const passwordHash = await argon2.hash(password);
    const user = await this.usersService.create({
      email,
      passwordHash,
      nickname,
    });

    return this.generateToken(user.id, user.email, user.nickname, user.role);
  }

  async login(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const ok = await argon2.verify(user.passwordHash, password);
    if (!ok) throw new UnauthorizedException('Invalid credentials');

    return this.generateToken(user.id, user.email, user.nickname, user.role);
  }

  private generateToken(
    sub: string,
    email: string,
    nickname: string,
    role: string,
  ) {
    const ttl = this.cfg.get<number>('JWT_TTL', 3600);
    const token = this.jwt.sign(
      { sub, email, nickname, role },
      { expiresIn: ttl },
    );

    return { accessToken: token, expiresIn: ttl };
  }
}
