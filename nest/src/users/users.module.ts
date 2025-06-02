import { Module } from '@nestjs/common';
import { UserService } from './users.service';
import { UserController } from './users.controller';
import { Membership } from '../memberships/entities/membership.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Wash } from '../washes/entities/wash.entity';
import { Car } from '../cars/entities/car.entity';
import { WashService } from '../washes/washes.service';

@Module({
  imports: [TypeOrmModule.forFeature([Membership, User, Car, Wash])],
  controllers: [UserController],
  providers: [UserService, WashService],
  exports: [UserService],
})
export class UsersModule {}
