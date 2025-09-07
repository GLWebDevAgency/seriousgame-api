import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

export interface JwtPayload {
  sub: string; // user id
  email: string;
  nickname: string;
  role: 'player' | 'admin';
  iat?: number;
  exp?: number;
}

/**
 * JwtStrategy lit et vérifie le JWT depuis l'en‑tête Authorization (Bearer).
 * Ici on verifie juste la signature et l'expiration.
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(cfg: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: cfg.getOrThrow<string>('JWT_SECRET'),
    });
  }

  validate(payload: JwtPayload) {
    if (!payload?.sub) throw new Error('Unauthorized');
    return payload;
  }
}
