import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { SignUpDto } from 'src/auth/dto/signupDto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async signUp(signUpDto: SignUpDto): Promise<User> {
    const emailTaken = await this.isEmailTaken(signUpDto.email);
    if (emailTaken) {
      throw new ConflictException('Email address already in use');
    }

    signUpDto.password = await bcrypt.hash(signUpDto.password, 10);
    const user = this.userRepository.create(signUpDto);
    return this.userRepository.save(user);
  }

  async isEmailTaken(email: string): Promise<boolean> {
    const count = await this.userRepository.count({ where: { email } });
    return count > 0;
  }

  async isMember(id: number): Promise<boolean> {
    const user = await this.findOne(id);

    return (
      user.memberships?.some((membership) => {
        if (membership.start && membership.end) {
          const now = new Date();
          return (
            new Date(membership.start) <= now && now <= new Date(membership.end)
          );
        }
        return false;
      }) ?? false
    );
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['memberships'],
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException('No account found with this email address.');
    }
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);
    const updatedUser = this.userRepository.merge(user, updateUserDto);
    return this.userRepository.save(updatedUser);
  }
}
