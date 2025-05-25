import { Injectable, HttpException } from '@nestjs/common';
import { CreateMembershipDto } from './dto/create-membership.dto';
import { UpdateMembershipDto } from './dto/update-membership.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Membership } from './entities/membership.entity';
import { User } from '../users/entities/user.entity';
import { Car } from 'src/cars/entities/car.entity';

@Injectable()
export class MembershipService {
  constructor(
    @InjectRepository(Membership)
    private readonly membershipRepository: Repository<Membership>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Car)
    private readonly carRepository: Repository<Car>,
  ) {}

  async create(createMembershipDto: CreateMembershipDto): Promise<Membership> {
    const user = await this.userRepository.findOne({
      where: { id: createMembershipDto.userId },
    });
    if (!user) {
      throw new HttpException('User Not Found', 404);
    }

    const car = await this.carRepository.findOne({
      where: { registrationNumber: createMembershipDto.licensePlate },
    });
    var newCar;
    if (!car) {
      newCar = await this.carRepository.save({
        registrationNumber: createMembershipDto.licensePlate,
      });
      createMembershipDto.carId = newCar.id;
    } else {
      createMembershipDto.carId = car.id;
    }

    const membership = this.membershipRepository.create({
      start: new Date(),
      end: new Date(new Date().setMonth(new Date().getMonth() + 1)),
      car: { id: createMembershipDto.carId },
      location: { id: createMembershipDto.locationId },
      membershipType: { id: createMembershipDto.typeId },
      user: { id: createMembershipDto.userId },
    });

    return this.membershipRepository.save(membership);
  }

  async getByUserAndCar(
    userId: number | undefined,
    carId: number | undefined,
  ): Promise<Membership> {
    if (!userId || !carId) {
      throw new HttpException('User ID and Car ID are required', 400);
    }
    const membership = await this.membershipRepository.findOne({
      where: { user: { id: userId }, car: { id: carId } },
      relations: ['user', 'car', 'location', 'membershipType'],
    });
    if (!membership) {
      throw new HttpException('Membership Not Found', 404);
    }
    return membership;
  }

  async getByUser(userId: number): Promise<Membership[]> {
    const memberships = await this.membershipRepository.find({
      where: { user: { id: userId } },
      relations: ['user', 'car', 'location', 'membershipType'],
    });
    if (!memberships) {
      throw new HttpException('Membership Not Found', 404);
    }
    return memberships || [];
  }

  async update(updateMembershipDto: UpdateMembershipDto): Promise<Membership> {
    const membership = await this.getByUserAndCar(
      updateMembershipDto.userId,
      updateMembershipDto.carId,
    );
    const updatedMembership = this.membershipRepository.merge(
      membership,
      updateMembershipDto,
    );
    return this.membershipRepository.save(updatedMembership);
  }
}
