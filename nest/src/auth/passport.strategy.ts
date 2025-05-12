import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy as StrategyJWT } from 'passport-jwt';
import { Strategy as StrategyLOCAL } from 'passport-local';
import { AuthService } from './auth.service';

import * as dotenv from 'dotenv';
dotenv.config();

@Injectable()
export class LocalStrategy extends PassportStrategy(StrategyLOCAL) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'email',
    });
  }

  async validate(email: string, password: string): Promise<any> {
    const user = await this.authService.validateUser(email, password);

    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}

@Injectable()
export class JwtStrategy extends PassportStrategy(StrategyJWT) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET, // This is the recommended way but requires everyone in the development team to have access to the key (create their .env file)
    });
  }

  async validate(payload: any) {
    return {
      id: payload.id,
      username: payload.username,
    };
  }
}
