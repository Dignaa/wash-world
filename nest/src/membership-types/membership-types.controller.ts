import { Controller, Get } from '@nestjs/common';
import { MembershipTypesService } from './membership-types.service';
import { MembershipType } from './entities/membership-type.entity';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('membership-types')
@Controller('membership-types')
export class MembershipTypesController {
  constructor(
    private readonly membershipTypesService: MembershipTypesService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Retrieve all membership types' })
  @ApiResponse({
    status: 200,
    description: 'Membership types retrieved successfully',
    type: [MembershipType],
  })
  findAll() {
    return this.membershipTypesService.findAll();
  }
}
