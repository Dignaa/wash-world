import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import dbConfig from '../data.source';
import { CarsModule } from './cars/cars.module';
import { LocationsModule } from './locations/locations.module';
import { MembershipsModule } from './memberships/memberships.module';
import { RewardsModule } from './rewards/rewards.module';
import { UsersModule } from './users/users.module';
import { WashesModule } from './washes/washes.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot(dbConfig.options),
    AuthModule,
    CarsModule,
    LocationsModule,
    MembershipsModule,
    RewardsModule,
    UsersModule,
    WashesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
