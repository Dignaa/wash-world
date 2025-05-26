import {
  Controller,
  Get,
  Body,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ResponseUserDto } from './dto/response-user.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { OwnershipGuard } from 'src/auth/ownership.guard';
import { WashService } from 'src/washes/washes.service';
import { plainToInstance } from 'class-transformer';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly washService: WashService,
  ) {}

  @UseGuards(JwtAuthGuard, OwnershipGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a user by ID' })
  @ApiResponse({
    status: 200,
    description: 'User details',
    type: ResponseUserDto,
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  async findOne(@Param('id') id: number): Promise<ResponseUserDto> {
    const user = await this.userService.findOne(id);
    return plainToInstance(ResponseUserDto, user);
  }

  @UseGuards(JwtAuthGuard, OwnershipGuard)
  @Put(':id')
  @ApiOperation({ summary: 'Update a user by ID' })
  @ApiResponse({
    status: 200,
    description: 'User updated successfully',
    type: ResponseUserDto,
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  async update(
    @Param('id') id: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<ResponseUserDto> {
    const updatedUser = await this.userService.update(id, updateUserDto);
    return plainToInstance(ResponseUserDto, updatedUser);
  }

  @UseGuards(JwtAuthGuard, OwnershipGuard)
  @ApiOperation({ summary: 'Get all washes for a user' })
  @ApiParam({ name: 'userId', type: Number })
  @Get(':userId/washes')
  async getWashesForUser(@Param('userId') userId: number) {
    return this.washService.findAll(userId);
  }
}
