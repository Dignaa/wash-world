import { Injectable, HttpException } from '@nestjs/common';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Car } from './entities/car.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class CarService {
  constructor(
    @InjectRepository(Car)
    private readonly carRepository: Repository<Car>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createCarDto: CreateCarDto): Promise<Car> {
    const user = await this.userRepository.findOne({ where: { id: createCarDto.userId } });
    if (!user) {
      throw new HttpException('User Not Found', 404);
    }

    const car = this.carRepository.create(createCarDto);
    car.user = user;

    return this.carRepository.save(car);
  }

  async findAll(): Promise<Car[]> {
    return this.carRepository.find();
  }

  async findOne(id: number): Promise<Car> {
    const car = await this.carRepository.findOne({ where: { id } });
    if (!car) {
      throw new HttpException('Car Not Found', 404);
    }
    return car;
  }

  async update(id: number, updateCarDto: UpdateCarDto): Promise<Car> {
    const car = await this.findOne(id);
    const updatedCar = this.carRepository.merge(car, updateCarDto);
    return this.carRepository.save(updatedCar);
  }

  async remove(id: number): Promise<Car> {
    const car = await this.findOne(id);
    return this.carRepository.remove(car);
  }
}
