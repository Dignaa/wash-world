import { Module } from '@nestjs/common';
import { MembershipTypesService } from './membership-types.service';
import { MembershipTypesController } from './membership-types.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MembershipType } from './entities/membership-type.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MembershipType])],
  controllers: [MembershipTypesController],
  providers: [MembershipTypesService],
})
export class MembershipTypesModule {}
