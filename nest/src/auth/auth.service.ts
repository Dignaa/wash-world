import { Injectable } from '@nestjs/common';
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

  async validateUser(emailAddress: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(emailAddress);
    console.log('User fetched:', user);

    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    console.log('Invalid credentials for:', emailAddress);

    return null;
  }

  async login(user: any) {
    const payload = {
      username: user.username,
      id: user.id,
    };

    return {
      token: this.jwtService.sign(payload),
    };
  }
}
