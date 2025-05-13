import { Controller, Get, Param } from '@nestjs/common';
import { WashTypesService } from './wash-types.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { WashType } from './entities/wash-type.entity';

@ApiTags('wash-types')
@Controller('wash-types')
export class WashTypesController {
  constructor(private readonly washTypesService: WashTypesService) {}

  @Get()
  @ApiOperation({ summary: 'Retrieve all wash types' })
  @ApiResponse({
    status: 200,
    description: 'Wash types retrieved successfully',
    type: [WashType],
  })
  findAll() {
    return this.washTypesService.findAll();
  }
}
