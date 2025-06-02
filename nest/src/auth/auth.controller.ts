import {
  Controller,
  Post,
  UseGuards,
  ForbiddenException,
  Body,
  ValidationPipe,
  UsePipes,
  Req,
  NotFoundException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './auth.guard';
import { SignUpDto } from './dto/signupDto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { User } from '../users/entities/user.entity';

@ApiTags('auth')
@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  @ApiOperation({ summary: 'Signs in the user' })
  @ApiResponse({ status: 200, description: 'JWT token' })
  async login(@Req() req) {
    return this.authService.login(req.user);
  }

  @Post('auth/signup')
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiOperation({ summary: 'Signs up the user' })
  @ApiResponse({ status: 200, description: 'Newly created User', type: User })
  signIn(@Body() signupDto: SignUpDto) {
    return this.authService.signup(signupDto);
  }
}
