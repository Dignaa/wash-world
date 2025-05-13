import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { CarService } from './cars.service';
import { CreateCarDto } from './dto/create-car.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Car } from './entities/car.entity';
import { JwtAuthGuard } from 'src/auth/auth.guard';

@ApiTags('car')
@Controller('car')
export class CarController {
  constructor(private readonly carService: CarService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new car' })
  @ApiResponse({
    status: 201,
    description: 'Car created successfully.',
    type: Car,
  })
  create(@Body() createCarDto: CreateCarDto) {
    return this.carService.create(createCarDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a car by ID' })
  @ApiResponse({ status: 200, description: 'Car details', type: Car })
  @ApiResponse({ status: 404, description: 'Car not found' })
  findOne(@Param('id') id: number) {
    return this.carService.findOne(id);
  }
}
