import { Module } from '@nestjs/common';
import { WashTypesService } from './wash-types.service';
import { WashTypesController } from './wash-types.controller';

@Module({
  controllers: [WashTypesController],
  providers: [WashTypesService],
})
export class WashTypesModule {}
