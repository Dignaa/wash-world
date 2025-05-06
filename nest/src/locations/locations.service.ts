import { Injectable, HttpException } from '@nestjs/common';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Location } from './entities/location.entity';

@Injectable()
export class LocationService {
  constructor(
    @InjectRepository(Location)
    private readonly locationRepository: Repository<Location>,
  ) {}

  async create(createLocationDto: CreateLocationDto): Promise<Location> {
    const location = this.locationRepository.create(createLocationDto);
    return this.locationRepository.save(location);
  }

  async findAll(): Promise<Location[]> {
    return this.locationRepository.find();
  }

  async findOne(id: number): Promise<Location> {
    const location = await this.locationRepository.findOne({ where: { id } });
    if (!location) {
      throw new HttpException('Location Not Found', 404);
    }
    return location;
  }

  async update(id: number, updateLocationDto: UpdateLocationDto): Promise<Location> {
    const location = await this.findOne(id);
    const updatedLocation = this.locationRepository.merge(location, updateLocationDto);
    return this.locationRepository.save(updatedLocation);
  }

  async remove(id: number): Promise<Location> {
    const location = await this.findOne(id);
    return this.locationRepository.remove(location);
  }
}
