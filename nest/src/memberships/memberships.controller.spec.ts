import { Test, TestingModule } from '@nestjs/testing';
import { MembershipsController } from './memberships.controller';
import { MembershipService } from './memberships.service';

describe('MembershipsController', () => {
  let controller: MembershipsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MembershipsController],
      providers: [MembershipService],
    }).compile();

    controller = module.get<MembershipsController>(MembershipsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
