import { HttpException, Injectable } from '@nestjs/common';
import { CreateWashDto } from './dto/create-wash.dto';
import { UpdateWashDto } from './dto/update-wash.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wash } from './entities/wash.entity';
import { Car } from 'src/cars/entities/car.entity';

@Injectable()
export class WashService {
  constructor(
    @InjectRepository(Wash)
    private readonly washRepository: Repository<Wash>,
    @InjectRepository(Car)
    private readonly carRepository: Repository<Car>,
  ) {}

  async create(createWashDto: CreateWashDto) {
    console.log('Create Wash:', createWashDto);

    if (!createWashDto.carId && !createWashDto.licensePlate) {
      throw new HttpException('Car ID or License Plate is required', 400);
    }

    if (createWashDto.licensePlate) {
      const car = await this.carRepository.findOne({
        where: { registrationNumber: createWashDto.licensePlate },
      });
      var newCar;
      if (!car) {
        newCar = await this.carRepository.save({
          registrationNumber: createWashDto.licensePlate,
        });
        createWashDto.carId = newCar.id;
      } else {
        createWashDto.carId = car.id;
      }
    }

    if (createWashDto.userId) {
      createWashDto.userId = createWashDto.userId;
    } else {
      createWashDto.userId = undefined;
    }

    const washData = this.washRepository.create({
      time: new Date(),
      rating: createWashDto.rating,
      emergencyStop: createWashDto.emergencyStop,
      car: { id: createWashDto.carId },
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
