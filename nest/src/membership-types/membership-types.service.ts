import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MembershipType } from './entities/membership-type.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MembershipTypesService {
  constructor(
    @InjectRepository(MembershipType)
    private readonly membershipTypeRepository: Repository<MembershipType>,
  ) {}

  findAll(): Promise<MembershipType[]> {
    return this.membershipTypeRepository.find();
  }
}
