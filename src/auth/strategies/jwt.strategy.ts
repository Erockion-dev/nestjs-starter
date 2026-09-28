import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from '../types/jwt-payload.type.js';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    confService: ConfigService
  ){
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: confService.get<string>('JWT_SECRET')!,
    });
  }
  async validate(payload: JwtPayload) {
    return payload;
  }
}
