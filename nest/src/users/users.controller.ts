import {
  Controller,
  Get,
  Body,
  Param,
  Put,
  Delete,
  UseGuards,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { UserService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { User } from './entities/user.entity';
import { PremiumUserGuard } from 'src/auth/member.guard';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { WashService } from 'src/washes/washes.service';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly washService: WashService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({ summary: 'Retrieve a user by ID' })
  @ApiResponse({ status: 200, description: 'User details', type: User })
  @ApiResponse({ status: 404, description: 'User not found' })
  findOne(@Query('userId') userId?: number, @Query('email') email?: string) {
    if (userId) {
      return this.userService.findOne(userId);
    } else if (email) {
      return this.userService.findByEmail(email);
    } else {
      throw new BadRequestException('No userId or email provided');
    }
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  @ApiOperation({ summary: 'Update a user by ID' })
  @ApiResponse({
    status: 200,
    description: 'User updated successfully',
    type: User,
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get all washes for a user' })
  @ApiParam({ name: 'userId', type: String })
  @Get(':userId/washes')
  getWashesForUser(@Param('userId') userId: string) {
    // implement this!
    return this.washService.findAll();
  }
}
