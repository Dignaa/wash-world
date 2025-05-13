import { Module } from '@nestjs/common';
import { UserService } from './users.service';
import { UserController } from './users.controller';
import { Membership } from 'src/memberships/entities/membership.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Wash } from 'src/washes/entities/wash.entity';
import { Car } from 'src/cars/entities/car.entity';
import { Reward } from 'src/rewards/entities/reward.entity';
import { WashService } from 'src/washes/washes.service';

@Module({
  imports: [TypeOrmModule.forFeature([Membership, User, Car, Wash, Reward])],
  controllers: [UserController],
  providers: [UserService, WashService],
  exports: [UserService],
})
export class UsersModule {}
