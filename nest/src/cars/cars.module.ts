import { Module } from '@nestjs/common';
import { CarService } from './cars.service';
import { CarsController } from './cars.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Car } from './entities/car.entity';
import { User } from 'src/users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Car, User])],
  controllers: [CarsController],
  providers: [CarService],
})
export class CarsModule {}
