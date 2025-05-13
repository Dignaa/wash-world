import { Injectable } from '@nestjs/common';

@Injectable()
export class WashTypesService {
  findAll() {
    return `This action returns all washTypes`;
  }

  findOne(id: number) {
    return `This action returns a #${id} washType`;
  }

  remove(id: number) {
    return `This action removes a #${id} washType`;
  }
}
