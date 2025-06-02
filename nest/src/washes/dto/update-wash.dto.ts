import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class UpdateWashDto {
  @ApiProperty({ example: 1 })
  @IsOptional()
  carId?: number;

  @ApiProperty({ example: 1 })
  @IsOptional()
  userId?: number;

  @ApiProperty({ example: 1 })
  @IsOptional()
  locationId?: number;

  @ApiProperty({ example: '2025-05-13T10:30:00Z' })
  @IsOptional()
  time?: Date;

  @ApiProperty({ example: 3 })
  @IsOptional()
  rating?: number;

  @ApiProperty({ example: 2 })
  @IsOptional()
  washTypeId?: number;

  @ApiProperty({ example: false })
  @IsOptional()
  emergencyStop?: boolean;
}
