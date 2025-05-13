import { Test, TestingModule } from '@nestjs/testing';
import { WashTypesController } from './wash-types.controller';
import { WashTypesService } from './wash-types.service';

describe('WashTypesController', () => {
  let controller: WashTypesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WashTypesController],
      providers: [WashTypesService],
    }).compile();

    controller = module.get<WashTypesController>(WashTypesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
