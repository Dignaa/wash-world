import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { WashTypesService } from './wash-types.service';

@Controller('wash-types')
export class WashTypesController {
  constructor(private readonly washTypesService: WashTypesService) {}

  @Get()
  findAll() {
    return this.washTypesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.washTypesService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.washTypesService.remove(+id);
  }
}
