import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Car } from '../cars/entities/car.entity';
import { Reward } from '../rewards/entities/reward.entity';
import { Membership } from '../memberships/entities/membership.entity';
import { Wash } from '../washes/entities/wash.entity';
import { SignUpDto } from 'src/auth/dto/signupDto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Car)
    private readonly carRepository: Repository<Car>,
    @InjectRepository(Reward)
    private readonly rewardRepository: Repository<Reward>,
    @InjectRepository(Membership)
    private readonly membershipRepository: Repository<Membership>,
    @InjectRepository(Wash)
    private readonly washRepository: Repository<Wash>,
  ) {}

  async signUp(signUpDto: SignUpDto): Promise<User> {
    console.log('SignUpDto:', signUpDto);
    if ((await this.isEmailUnique(signUpDto.email)) === false) {
      signUpDto.password = await bcrypt.hash(signUpDto.password, 10);
      const user = this.userRepository.create(signUpDto);
      return this.userRepository.save(user);
    } else {
      throw new ConflictException('Email address already in use');
    }
  }

  async isEmailUnique(email: string): Promise<boolean> {
    const count = await this.userRepository.count({ where: { email } });
    return count > 0;
  }

  async isMember(id: number): Promise<boolean> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user.memberships.some((membership) => {
      if (membership.start && membership.end) {
        const startDate = new Date(membership.start);
        const endDate = new Date(membership.end);
        const currentDate = new Date();
        return startDate <= currentDate && endDate >= currentDate;
      }
      return false;
    });
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOne(id: number): Promise<User | null> {
    const user = await this.userRepository.findOne({ where: { id } });
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.userRepository.findOne({ where: { email } });
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    const updatedUser = this.userRepository.merge(user, updateUserDto);
    return this.userRepository.save(updatedUser);
  }

  async remove(id: number): Promise<User> {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return this.userRepository.remove(user);
  }
}
