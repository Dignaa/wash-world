import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { MembershipService } from './memberships.service';
import { CreateMembershipDto } from './dto/create-membership.dto';
import { UpdateMembershipDto } from './dto/update-membership.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { Membership } from './entities/membership.entity';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { PremiumUserGuard } from 'src/auth/member.guard';

@ApiTags('memberships')
@Controller('users/:userId/memberships')
export class MembershipsController {
  constructor(private readonly membershipsService: MembershipService) {}

  @UseGuards(JwtAuthGuard)
  @Post(':carId')
  @ApiOperation({ summary: 'Create a new membership' })
  @ApiResponse({
    status: 201,
    description: 'Membership created successfully.',
    type: Membership,
  })
  create(
    @Param('userId') userId: Number,
    @Param('carId') carId: Number,
    @Body() createMembershipDto: CreateMembershipDto,
  ) {
    //  return this.membershipService.create(userId, carId, createMembershipDto);
    return this.membershipsService.create(createMembershipDto);
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
  findOne(@Param('userId') userId: number, @Param('carId') carId: number) {
    //return this.membershipService.getByUserAndCar(userId, carId);
    return this.membershipsService.find(userId);
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
  findMany(@Param('userId') userId: number) {
    //return this.membershipService.getByUser(userId);
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
  ) {
    // return this.membershipsService.update(userId, carId, updateMembershipDto);
    return this.membershipsService.update(userId, updateMembershipDto);
  }
}
