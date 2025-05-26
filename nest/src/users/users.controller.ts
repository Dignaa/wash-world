import {
  Controller,
  Get,
  Body,
  Param,
  Put,
  UseGuards,
  Request,
  UnauthorizedException,
  Patch,
} from '@nestjs/common';
import { UserService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { User } from './entities/user.entity';
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
  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a user by ID' })
  @ApiResponse({ status: 200, description: 'User details', type: User })
  @ApiResponse({ status: 404, description: 'User not found' })
  findOne(@Param('id') id: number, @Request() req) {
    const tokenUserId: number = req.user?.id;
    if (tokenUserId && tokenUserId != id) {
      throw new UnauthorizedException(
        'You do not have access to other users data. Please use your own user ID.',
      );
    }
    return this.userService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @ApiOperation({ summary: 'Update user information' })
  @ApiResponse({
    status: 200,
    description: 'User updated successfully',
    type: User,
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  update(
    @Param('id') id: number,
    @Body() updateUserDto: UpdateUserDto,
    @Request() req,
  ) {
    const tokenUserId: number = req.user?.id;
    if (tokenUserId && tokenUserId != id) {
      throw new UnauthorizedException(
        'You do not have access to other users data. Please use your own user ID.',
      );
    }
    return this.userService.update(id, updateUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get all washes for a user' })
  @ApiParam({ name: 'userId', type: Number })
  @Get(':userId/washes')
  getWashesForUser(@Param('userId') userId: number, @Request() req) {
    const tokenUserId: number = req.user?.id;
    if (tokenUserId && tokenUserId != userId) {
      throw new UnauthorizedException(
        'You do not have access to other users data. Please use your own user ID.',
      );
    }
    return this.washService.findAll(userId);
  }
}
