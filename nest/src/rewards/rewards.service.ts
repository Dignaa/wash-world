import { Injectable, HttpException } from '@nestjs/common';
import { CreateRewardDto } from './dto/create-reward.dto';
import { UpdateRewardDto } from './dto/update-reward.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reward } from './entities/reward.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class RewardService {
  constructor(
    @InjectRepository(Reward)
    private readonly rewardRepository: Repository<Reward>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createRewardDto: CreateRewardDto): Promise<Reward> {
    const user = await this.userRepository.findOne({ where: { id: createRewardDto.userId } });
    if (!user) {
      throw new HttpException('User Not Found', 404);
    }

    const reward = this.rewardRepository.create(createRewardDto);
    reward.user = user;

    return this.rewardRepository.save(reward);
  }

  async findAll(): Promise<Reward[]> {
    return this.rewardRepository.find();
  }

  async findOne(id: number): Promise<Reward> {
    const reward = await this.rewardRepository.findOne({ where: { id } });
    if (!reward) {
      throw new HttpException('Reward Not Found', 404);
    }
    return reward;
  }

  async update(id: number, updateRewardDto: UpdateRewardDto): Promise<Reward> {
    const reward = await this.findOne(id);
    const updatedReward = this.rewardRepository.merge(reward, updateRewardDto);
    return this.rewardRepository.save(updatedReward);
  }

  async remove(id: number): Promise<Reward> {
    const reward = await this.findOne(id);
    return this.rewardRepository.remove(reward);
  }
}
