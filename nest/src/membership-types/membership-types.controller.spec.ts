import { Test, TestingModule } from '@nestjs/testing';
import { MembershipTypesController } from './membership-types.controller';
import { MembershipTypesService } from './membership-types.service';

describe('MembershipTypesController', () => {
  let controller: MembershipTypesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MembershipTypesController],
      providers: [MembershipTypesService],
    }).compile();

    controller = module.get<MembershipTypesController>(MembershipTypesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
