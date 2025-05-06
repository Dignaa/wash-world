import { Test, TestingModule } from '@nestjs/testing';
import { WashController } from './washes.controller';
import { WashService } from './washes.service';

describe('WashesController', () => {
  let controller: WashController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WashController],
      providers: [WashService],
    }).compile();

    controller = module.get<WashController>(WashController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
