import { Injectable, HttpException } from '@nestjs/common';
import { CreateMembershipDto } from './dto/create-membership.dto';
import { UpdateMembershipDto } from './dto/update-membership.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Membership } from './entities/membership.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class MembershipService {
  constructor(
    @InjectRepository(Membership)
    private readonly membershipRepository: Repository<Membership>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createMembershipDto: CreateMembershipDto): Promise<Membership> {
    const user = await this.userRepository.findOne({
      where: { id: createMembershipDto.userId },
    });
    if (!user) {
      throw new HttpException('User Not Found', 404);
    }

    const membership = this.membershipRepository.create(createMembershipDto);
    membership.user = user;

    return this.membershipRepository.save(membership);
  }

  async find(id: number): Promise<Membership> {
    const membership = await this.membershipRepository.findOne({
      where: { id },
    });
    if (!membership) {
      throw new HttpException('Membership Not Found', 404);
    }
    return membership;
  }

  async update(
    id: number,
    updateMembershipDto: UpdateMembershipDto,
  ): Promise<Membership> {
    const membership = await this.find(id);
    const updatedMembership = this.membershipRepository.merge(
      membership,
      updateMembershipDto,
    );
    return this.membershipRepository.save(updatedMembership);
  }
}
