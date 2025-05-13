import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MembershipTypesService } from './membership-types.service';

@Controller('membership-types')
export class MembershipTypesController {
  constructor(private readonly membershipTypesService: MembershipTypesService) {}

  @Get()
  findAll() {
    return this.membershipTypesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.membershipTypesService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.membershipTypesService.remove(+id);
  }
}
