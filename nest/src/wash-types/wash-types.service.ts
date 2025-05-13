import { Injectable } from '@nestjs/common';
import { CreateWashTypeDto } from './dto/create-wash-type.dto';
import { UpdateWashTypeDto } from './dto/update-wash-type.dto';

@Injectable()
export class WashTypesService {
  create(createWashTypeDto: CreateWashTypeDto) {
    return 'This action adds a new washType';
  }

  findAll() {
    return `This action returns all washTypes`;
  }

  findOne(id: number) {
    return `This action returns a #${id} washType`;
  }

  update(id: number, updateWashTypeDto: UpdateWashTypeDto) {
    return `This action updates a #${id} washType`;
  }

  remove(id: number) {
    return `This action removes a #${id} washType`;
  }
}
