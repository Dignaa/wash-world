import { Module } from '@nestjs/common';
import { LocationService } from './locations.service';
import { LocationController } from './locations.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Location } from './entities/location.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Location])],
  controllers: [LocationController],
  providers: [LocationService],
})
export class LocationsModule {}
