import { Module } from '@nestjs/common';
import { RewardService } from './rewards.service';
import { RewardsController } from './rewards.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reward } from './entities/reward.entity';
import { User } from 'src/users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Reward, User])],
  controllers: [RewardsController],
  providers: [RewardService],
})
export class RewardsModule {}
