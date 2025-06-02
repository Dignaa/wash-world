import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { SignUpDto } from './dto/signupDto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}

  async signup(signupDto: SignUpDto) {
    return this.usersService.signUp(signupDto);
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);

    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user;
      return result;
    } else {
      throw new UnauthorizedException(
        'Incorrect email or password. Please try again.',
      );
    }
  }

  async login(user: any) {
    const payload = {
      username: user.name,
      id: user.id,
    };

    return {
      token: this.jwtService.sign(payload),
    };
  }
}
