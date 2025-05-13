import { Test, TestingModule } from '@nestjs/testing';
import { WashTypesService } from './wash-types.service';

describe('WashTypesService', () => {
  let service: WashTypesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WashTypesService],
    }).compile();

    service = module.get<WashTypesService>(WashTypesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
