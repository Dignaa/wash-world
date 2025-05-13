import { Controller, Get, Body, Param, Put, Delete } from '@nestjs/common';
import { LocationService } from './locations.service';
import { UpdateLocationDto } from './dto/update-location.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Location } from './entities/location.entity';

@ApiTags('location')
@Controller('location')
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @Get()
  @ApiOperation({ summary: 'Retrieve all locations' })
  @ApiResponse({
    status: 200,
    description: 'List of locations',
    type: [Location],
  })
  findAll() {
    return this.locationService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a location by ID' })
  @ApiResponse({ status: 200, description: 'Location details', type: Location })
  @ApiResponse({ status: 404, description: 'Location not found' })
  findOne(@Param('id') id: number) {
    return this.locationService.findOne(id);
  }
}
