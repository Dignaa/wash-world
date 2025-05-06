import { Test, TestingModule } from '@nestjs/testing';
import { RewardsController } from './rewards.controller';
import { RewardService } from './rewards.service';

describe('RewardsController', () => {
  let controller: RewardsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RewardsController],
      providers: [RewardService],
    }).compile();

    controller = module.get<RewardsController>(RewardsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
