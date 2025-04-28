import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { WashService } from './washes.service';
import { CreateWashDto } from './dto/create-wash.dto';
import { UpdateWashDto } from './dto/update-wash.dto';

@Controller('washes')
export class WashesController {
  constructor(private readonly washesService: WashService) {}

  @Post()
  create(@Body() createWashDto: CreateWashDto) {
    return this.washesService.create(createWashDto);
  }

  @Get()
  findAll() {
    return this.washesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.washesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateWashDto: UpdateWashDto) {
    return this.washesService.update(+id, updateWashDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.washesService.remove(+id);
  }
}
