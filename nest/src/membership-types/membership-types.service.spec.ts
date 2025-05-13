import { Test, TestingModule } from '@nestjs/testing';
import { MembershipTypesService } from './membership-types.service';

describe('MembershipTypesService', () => {
  let service: MembershipTypesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MembershipTypesService],
    }).compile();

    service = module.get<MembershipTypesService>(MembershipTypesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
