import {
  HttpException,
  Injectable,
} from '@nestjs/common';
import { CreateWashDto } from './dto/create-wash.dto';
import { UpdateWashDto } from './dto/update-wash.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wash } from './entities/wash.entity';


@Injectable()
export class WashService {
  constructor(
    @InjectRepository(Wash)
    private readonly washRepository: Repository<Wash>,
  ) {}

  async create(
    createWashDto: CreateWashDto,
   ) {
    const washData =
       this.washRepository.create(
        createWashDto,
      );

    return this.washRepository.save(washData);
  }

  async findAll(): Promise<Wash[]> {
    return await this.washRepository.find();
  }

  async findOne(id: number): Promise<Wash> {
    const washData =
      await this.washRepository.findOneBy({ id });
    if (!washData) {
      throw new HttpException(
        'Wash Not Found',
        404,
      );
    }
    return washData;
  }

  async update(
    id: number,
    updateWashDto: UpdateWashDto,
  ): Promise<Wash> {
    const existingWash = await this.findOne(id);
    const washData = this.washRepository.merge(
      existingWash,
      updateWashDto,
    );
    return await this.washRepository.save(
      washData,
    );
  }

  async remove(id: number): Promise<Wash> {
    const existingWash = await this.findOne(id);
    return await this.washRepository.remove(
      existingWash,
    );
  }
}