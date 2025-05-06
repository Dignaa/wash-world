import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { CarService } from './cars.service';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Car } from './entities/car.entity';

@ApiTags('car')
@Controller('car')
export class CarController {
  constructor(private readonly carService: CarService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new car' })
  @ApiResponse({ status: 201, description: 'Car created successfully.', type: Car })
  create(@Body() createCarDto: CreateCarDto) {
    return this.carService.create(createCarDto);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all cars' })
  @ApiResponse({ status: 200, description: 'List of cars', type: [Car] })
  findAll() {
    return this.carService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a car by ID' })
  @ApiResponse({ status: 200, description: 'Car details', type: Car })
  @ApiResponse({ status: 404, description: 'Car not found' })
  findOne(@Param('id') id: number) {
    return this.carService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a car by ID' })
  @ApiResponse({ status: 200, description: 'Car updated successfully', type: Car })
  @ApiResponse({ status: 404, description: 'Car not found' })
  update(@Param('id') id: number, @Body() updateCarDto: UpdateCarDto) {
    return this.carService.update(id, updateCarDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a car by ID' })
  @ApiResponse({ status: 200, description: 'Car deleted successfully', type: Car })
  @ApiResponse({ status: 404, description: 'Car not found' })
  remove(@Param('id') id: number) {
    return this.carService.remove(id);
  }
}
