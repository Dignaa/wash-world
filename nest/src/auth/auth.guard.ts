import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'emailAdress',
    });
  }
}
