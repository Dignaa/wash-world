import { Module } from '@nestjs/common';
import { WashTypesService } from './wash-types.service';
import { WashTypesController } from './wash-types.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WashType } from './entities/wash-type.entity';

@Module({
  imports: [TypeOrmModule.forFeature([WashType])],
  controllers: [WashTypesController],
  providers: [WashTypesService],
})
export class WashTypesModule {}
