import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { WashTypesService } from './wash-types.service';
import { CreateWashTypeDto } from './dto/create-wash-type.dto';
import { UpdateWashTypeDto } from './dto/update-wash-type.dto';

@Controller('wash-types')
export class WashTypesController {
  constructor(private readonly washTypesService: WashTypesService) {}

  @Post()
  create(@Body() createWashTypeDto: CreateWashTypeDto) {
    return this.washTypesService.create(createWashTypeDto);
  }

  @Get()
  findAll() {
    return this.washTypesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.washTypesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateWashTypeDto: UpdateWashTypeDto) {
    return this.washTypesService.update(+id, updateWashTypeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.washTypesService.remove(+id);
  }
}
