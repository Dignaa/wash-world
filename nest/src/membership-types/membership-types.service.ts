import { Injectable } from '@nestjs/common';

@Injectable()
export class MembershipTypesService {
  findAll() {
    return `This action returns all membershipTypes`;
  }

  findOne(id: number) {
    return `This action returns a #${id} membershipType`;
  }

  remove(id: number) {
    return `This action removes a #${id} membershipType`;
  }
}
