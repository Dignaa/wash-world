import { Injectable } from '@nestjs/common';
import { CreateMembershipTypeDto } from './dto/create-membership-type.dto';
import { UpdateMembershipTypeDto } from './dto/update-membership-type.dto';

@Injectable()
export class MembershipTypesService {
  create(createMembershipTypeDto: CreateMembershipTypeDto) {
    return 'This action adds a new membershipType';
  }

  findAll() {
    return `This action returns all membershipTypes`;
  }

  findOne(id: number) {
    return `This action returns a #${id} membershipType`;
  }

  update(id: number, updateMembershipTypeDto: UpdateMembershipTypeDto) {
    return `This action updates a #${id} membershipType`;
  }

  remove(id: number) {
    return `This action removes a #${id} membershipType`;
  }
}
