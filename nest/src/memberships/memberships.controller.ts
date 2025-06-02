import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { MembershipService } from './memberships.service';
import { CreateMembershipDto } from './dto/create-membership.dto';
import { UpdateMembershipDto } from './dto/update-membership.dto';
import { ExtendMembershipDto } from './dto/extend-membership.dto';
import { UpgradeMembershipDto } from './dto/upgrade-membership.dto';
import { Membership } from './entities/membership.entity';

import { JwtAuthGuard } from '../auth/auth.guard';
import { PremiumUserGuard } from '../auth/member.guard';
import { OwnershipGuard } from '../auth/ownership.guard';

import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('user')
@Controller('user/:userId/memberships')
export class MembershipsController {
  constructor(private readonly membershipService: MembershipService) {}

  @UseGuards(JwtAuthGuard, OwnershipGuard)
  @Post()
  @ApiOperation({ summary: 'Create a new membership for a user' })
  @ApiParam({ name: 'userId', type: Number })
  @ApiBody({ type: CreateMembershipDto })
  @ApiResponse({ status: 201, description: 'Membership created successfully.', type: Membership })
  create(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() createMembershipDto: CreateMembershipDto,
  ) {
    createMembershipDto.userId = userId;
    return this.membershipService.create(createMembershipDto);
  }

  @UseGuards(JwtAuthGuard, OwnershipGuard)
  @Get(':carId')
  @ApiOperation({ summary: 'Get a membership by user ID and car ID' })
  @ApiParam({ name: 'userId', type: Number })
  @ApiParam({ name: 'carId', type: Number })
  @ApiResponse({ status: 200, description: 'Membership found', type: Membership })
  @ApiResponse({ status: 404, description: 'Membership not found' })
  findOne(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('carId', ParseIntPipe) carId: number,
  ) {
    return this.membershipService.getByUserAndCar(userId, carId);
  }

  @UseGuards(JwtAuthGuard, OwnershipGuard)
  @Get()
  @ApiOperation({ summary: 'Get all memberships of a user' })
  @ApiParam({ name: 'userId', type: Number })
  @ApiResponse({ status: 200, description: 'Memberships found', type: [Membership] })
  @ApiResponse({ status: 404, description: 'Membership not found' })
  findMany(@Param('userId', ParseIntPipe) userId: number) {
    return this.membershipService.getByUser(userId);
  }

  @UseGuards(PremiumUserGuard, OwnershipGuard)
  @Patch(':carId')
  @ApiOperation({ summary: 'Update a membership by user ID and car ID' })
  @ApiParam({ name: 'userId', type: Number })
  @ApiParam({ name: 'carId', type: Number })
  @ApiBody({ type: UpdateMembershipDto })
  @ApiResponse({ status: 200, description: 'Membership updated successfully', type: Membership })
  @ApiResponse({ status: 404, description: 'Membership not found' })
  update(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('carId', ParseIntPipe) carId: number,
    @Body() updateMembershipDto: UpdateMembershipDto,
  ) {
    updateMembershipDto.userId = userId;
    updateMembershipDto.carId = carId;
    return this.membershipService.update(updateMembershipDto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/extend')
  @ApiOperation({ summary: 'Extend an existing membership' })
  @ApiParam({ name: 'id', type: Number, description: 'Membership ID to extend' })
  @ApiBody({ type: ExtendMembershipDto })
  @ApiResponse({ status: 200, description: 'Membership extended successfully', type: Membership })
  @ApiResponse({ status: 404, description: 'Membership not found' })
  extend(
    @Param('id', ParseIntPipe) id: number,
    @Body() extendDto: ExtendMembershipDto,
  ) {
    return this.membershipService.extendMembership(id, extendDto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/upgrade')
  @ApiOperation({ summary: 'Upgrade an existing membership' })
  @ApiParam({ name: 'id', type: Number, description: 'Membership ID to upgrade' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        newTypeId: { type: 'number' },
      },
      required: ['newTypeId'],
    },
  })
  @ApiResponse({ status: 200, description: 'Membership upgraded successfully', type: Membership })
  @ApiResponse({ status: 404, description: 'Membership or membership type not found' })
  @ApiResponse({ status: 400, description: 'Invalid upgrade' })
  upgrade(
    @Param('id', ParseIntPipe) id: number,
    @Body() upgradeMembershipDto: UpgradeMembershipDto,
  ) {
    const { newTypeId } = upgradeMembershipDto;
    return this.membershipService.upgradeMembership(id, newTypeId);
  }
}
