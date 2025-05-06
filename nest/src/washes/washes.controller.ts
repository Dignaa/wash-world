import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { WashService } from './washes.service';
import { CreateWashDto } from './dto/create-wash.dto';
import { UpdateWashDto } from './dto/update-wash.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Wash } from './entities/wash.entity';

@ApiTags('wash')
@Controller('wash')
export class WashController {
  constructor(private readonly washService: WashService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new wash' })
  @ApiResponse({ status: 201, description: 'Wash created successfully.', type: Wash })
  create(@Body() createWashDto: CreateWashDto) {
    return this.washService.create(createWashDto);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all washes' })
  @ApiResponse({ status: 200, description: 'List of washes', type: [Wash] })
  findAll() {
    return this.washService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a wash by ID' })
  @ApiResponse({ status: 200, description: 'Wash details', type: Wash })
  @ApiResponse({ status: 404, description: 'Wash not found' })
  findOne(@Param('id') id: number) {
    return this.washService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a wash by ID' })
  @ApiResponse({ status: 200, description: 'Wash updated successfully', type: Wash })
  @ApiResponse({ status: 404, description: 'Wash not found' })
  update(@Param('id') id: number, @Body() updateWashDto: UpdateWashDto) {
    return this.washService.update(id, updateWashDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a wash by ID' })
  @ApiResponse({ status: 200, description: 'Wash deleted successfully', type: Wash })
  @ApiResponse({ status: 404, description: 'Wash not found' })
  remove(@Param('id') id: number) {
    return this.washService.remove(id);
  }
}
