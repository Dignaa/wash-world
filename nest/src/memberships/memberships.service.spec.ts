import { Test, TestingModule } from '@nestjs/testing';
import { MembershipService } from './memberships.service';

describe('MembershipsService', () => {
  let service: MembershipService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MembershipService],
    }).compile();

    service = module.get<MembershipService>(MembershipService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
