import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import dbConfig from '../data.source';
import { CarsModule } from './cars/cars.module';
import { LocationsModule } from './locations/locations.module';
import { MembershipsModule } from './memberships/memberships.module';
import { UsersModule } from './users/users.module';
import { WashesModule } from './washes/washes.module';
import { AuthModule } from './auth/auth.module';
import { MembershipTypesModule } from './membership-types/membership-types.module';
import { WashTypesModule } from './wash-types/wash-types.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot(dbConfig.options),
    AuthModule,
    CarsModule,
    LocationsModule,
    MembershipsModule,
    MembershipTypesModule,
    WashTypesModule,
    UsersModule,
    WashesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
