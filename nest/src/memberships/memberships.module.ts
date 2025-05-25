import { Module } from '@nestjs/common';
import { MembershipService } from './memberships.service';
import { MembershipsController } from './memberships.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Membership } from './entities/membership.entity';
import { User } from 'src/users/entities/user.entity';
import { Car } from 'src/cars/entities/car.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Membership, User, Car])],
  controllers: [MembershipsController],
  providers: [MembershipService],
})
export class MembershipsModule {}
