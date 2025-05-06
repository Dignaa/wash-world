import { Module } from '@nestjs/common';
import { WashService } from './washes.service';
import { WashController } from './washes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wash } from './entities/wash.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Wash])],
  controllers: [WashController],
  providers: [WashService],
})
export class WashesModule {}
