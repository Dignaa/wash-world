import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WashType } from './entities/wash-type.entity';

@Injectable()
export class WashTypesService {
  constructor(
    @InjectRepository(WashType)
    private readonly washTypeRepository: Repository<WashType>,
  ) {}

  findAll(): Promise<WashType[]> {
    return this.washTypeRepository.find();
  }
}
