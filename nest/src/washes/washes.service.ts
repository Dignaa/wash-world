import { HttpException, Injectable } from '@nestjs/common';
import { CreateWashDto } from './dto/create-wash.dto';
import { UpdateWashDto } from './dto/update-wash.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wash } from './entities/wash.entity';

@Injectable()
export class WashService {
  constructor(
    @InjectRepository(Wash)
    private readonly washRepository: Repository<Wash>,
  ) {}

  async create(createWashDto: CreateWashDto) {
    const washData = this.washRepository.create({
      time: new Date(),
      rating: createWashDto.rating,
      emergencyStop: createWashDto.emergencyStop,
      car: { id: createWashDto.carId },
      user: { id: createWashDto.userId },
      location: { id: createWashDto.locationId },
      washType: { id: createWashDto.washTypeId },
    });
    return this.washRepository.save(washData);
  }

  async findAll(id: number): Promise<Wash[]> {
    return await this.washRepository.find({
      where: { user: { id: id } },
      relations: ['user', 'car', 'location', 'washType'],
    });
  }

  async findOne(id: number): Promise<Wash | null> {
    return await this.washRepository.findOne({
      where: { id: id },
      relations: ['user', 'car', 'location', 'washType'],
    });
  }

  async update(id: number, updateWashDto: UpdateWashDto): Promise<Wash | null> {
    const existingWash = await this.findOne(id);
    if (!existingWash) {
      throw new HttpException('Wash Not Found', 404);
    }
    Object.assign(existingWash, updateWashDto);
    return await this.washRepository.save(existingWash);
  }

  async remove(id: number): Promise<Wash | null> {
    const existingWash = await this.findOne(id);
    if (!existingWash) {
      throw new HttpException('Wash Not Found', 404);
    }
    return await this.washRepository.remove(existingWash);
  }
}
