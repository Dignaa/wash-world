import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { RewardService } from './rewards.service';
import { CreateRewardDto } from './dto/create-reward.dto';
import { UpdateRewardDto } from './dto/update-reward.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Reward } from './entities/reward.entity';

@ApiTags('reward')
@Controller('reward')
export class RewardController {
  constructor(private readonly rewardService: RewardService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new reward' })
  @ApiResponse({ status: 201, description: 'Reward created successfully.', type: Reward })
  create(@Body() createRewardDto: CreateRewardDto) {
    return this.rewardService.create(createRewardDto);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all rewards' })
  @ApiResponse({ status: 200, description: 'List of rewards', type: [Reward] })
  findAll() {
    return this.rewardService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a reward by ID' })
  @ApiResponse({ status: 200, description: 'Reward details', type: Reward })
  @ApiResponse({ status: 404, description: 'Reward not found' })
  findOne(@Param('id') id: number) {
    return this.rewardService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a reward by ID' })
  @ApiResponse({ status: 200, description: 'Reward updated successfully', type: Reward })
  @ApiResponse({ status: 404, description: 'Reward not found' })
  update(@Param('id') id: number, @Body() updateRewardDto: UpdateRewardDto) {
    return this.rewardService.update(id, updateRewardDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a reward by ID' })
  @ApiResponse({ status: 200, description: 'Reward deleted successfully', type: Reward })
  @ApiResponse({ status: 404, description: 'Reward not found' })
  remove(@Param('id') id: number) {
    return this.rewardService.remove(id);
  }
}
