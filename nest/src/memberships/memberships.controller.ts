import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { MembershipService } from './memberships.service';
import { CreateMembershipDto } from './dto/create-membership.dto';
import { UpdateMembershipDto } from './dto/update-membership.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { Membership } from './entities/membership.entity';

@ApiTags('memberships')
@Controller('memberships')
export class MembershipsController {
  constructor(private readonly membershipsService: MembershipService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new membership' })
  @ApiResponse({ status: 201, description: 'Membership created successfully.', type: Membership })
  create(@Body() createMembershipDto: CreateMembershipDto) {
    return this.membershipsService.create(createMembershipDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all memberships' })
  @ApiResponse({ status: 200, description: 'List of all memberships', type: [Membership] })
  findAll() {
    return this.membershipsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a membership by ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Membership found', type: Membership })
  @ApiResponse({ status: 404, description: 'Membership not found' })
  findOne(@Param('id') id: string) {
    return this.membershipsService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a membership by ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Membership updated', type: Membership })
  @ApiResponse({ status: 404, description: 'Membership not found' })
  update(@Param('id') id: string, @Body() updateMembershipDto: UpdateMembershipDto) {
    return this.membershipsService.update(+id, updateMembershipDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a membership by ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Membership deleted', type: Membership })
  @ApiResponse({ status: 404, description: 'Membership not found' })
  remove(@Param('id') id: string) {
    return this.membershipsService.remove(+id);
  }
}
