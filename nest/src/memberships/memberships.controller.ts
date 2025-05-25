import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  UnauthorizedException,
  Request,
} from '@nestjs/common';
import { MembershipService } from './memberships.service';
import { CreateMembershipDto } from './dto/create-membership.dto';
import { UpdateMembershipDto } from './dto/update-membership.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { Membership } from './entities/membership.entity';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { PremiumUserGuard } from 'src/auth/member.guard';

@ApiTags('user')
@Controller('user/:userId/memberships')
export class MembershipsController {
  constructor(private readonly membershipService: MembershipService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({ summary: 'Create a new membership' })
  @ApiResponse({
    status: 201,
    description: 'Membership created successfully.',
    type: Membership,
  })
  create(
    @Param('userId') userId: number,
    @Body() createMembershipDto: CreateMembershipDto,
    @Request() req,
  ) {
    const tokenUserId: number = req.user?.id;
    if (tokenUserId && tokenUserId != userId) {
      throw new UnauthorizedException(
        'You do not have access to other users data. Please use your own user ID.',
      );
    }
    createMembershipDto.userId = userId;
    return this.membershipService.create(createMembershipDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':carId')
  @ApiOperation({ summary: 'Get a membership by user ID and car ID' })
  @ApiParam({ name: 'userId', type: Number })
  @ApiParam({ name: 'carId', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Membership found',
    type: Membership,
  })
  @ApiResponse({ status: 404, description: 'Membership not found' })
  findOne(
    @Param('userId') userId: number,
    @Param('carId') carId: number,
    @Request() req,
  ) {
    const tokenUserId: number = req.user?.id;
    if (tokenUserId && tokenUserId != userId) {
      throw new UnauthorizedException(
        'You do not have access to other users data. Please use your own user ID.',
      );
    }
    return this.membershipService.getByUserAndCar(userId, carId);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({ summary: 'Get memberships of a user by UserID' })
  @ApiParam({ name: 'userId', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Membership found',
    type: Membership,
  })
  @ApiResponse({ status: 404, description: 'Membership not found' })
  findMany(@Param('userId') userId: number, @Request() req) {
    const tokenUserId: number = req.user?.id;
    if (tokenUserId && tokenUserId != userId) {
      throw new UnauthorizedException(
        'You do not have access to other users data. Please use your own user ID.',
      );
    }
    return this.membershipService.getByUser(userId);
  }

  @UseGuards(PremiumUserGuard)
  @Patch(':carId')
  @ApiOperation({ summary: 'Update a membership by ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Membership updated',
    type: Membership,
  })
  @ApiResponse({ status: 404, description: 'Membership not found' })
  update(
    @Param('userId') userId: number,
    @Param('carId') carId: number,
    @Body() updateMembershipDto: UpdateMembershipDto,
    @Request() req,
  ) {
    const tokenUserId: number = req.user?.id;
    if (tokenUserId && tokenUserId != userId) {
      throw new UnauthorizedException(
        'You do not have access to other users data. Please use your own user ID.',
      );
    }
    updateMembershipDto.userId = userId;
    updateMembershipDto.carId = carId;
    return this.membershipService.update(updateMembershipDto);
  }
}
