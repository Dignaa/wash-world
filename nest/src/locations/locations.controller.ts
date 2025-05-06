import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { LocationService } from './locations.service';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Location } from './entities/location.entity';

@ApiTags('location')
@Controller('location')
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new location' })
  @ApiResponse({ status: 201, description: 'Location created successfully.', type: Location })
  create(@Body() createLocationDto: CreateLocationDto) {
    return this.locationService.create(createLocationDto);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all locations' })
  @ApiResponse({ status: 200, description: 'List of locations', type: [Location] })
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

  @Put(':id')
  @ApiOperation({ summary: 'Update a location by ID' })
  @ApiResponse({ status: 200, description: 'Location updated successfully', type: Location })
  @ApiResponse({ status: 404, description: 'Location not found' })
  update(@Param('id') id: number, @Body() updateLocationDto: UpdateLocationDto) {
    return this.locationService.update(id, updateLocationDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a location by ID' })
  @ApiResponse({ status: 200, description: 'Location deleted successfully', type: Location })
  @ApiResponse({ status: 404, description: 'Location not found' })
  remove(@Param('id') id: number) {
    return this.locationService.remove(id);
  }
}
