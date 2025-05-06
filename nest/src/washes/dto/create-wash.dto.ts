import { ApiProperty } from '@nestjs/swagger';

export class CreateWashDto {
  @ApiProperty({ example: 1 })
  carId: number;

  @ApiProperty({ example: 1 })
  userId: number;

  @ApiProperty({ example: 2 })
  locationId: number;

  @ApiProperty({ example: '2025-04-29T15:00:00.000Z' })
  time: Date;

  @ApiProperty({ example: 4.5, required: false })
  rating?: number;

  @ApiProperty({ example: false })
  emergencyStop: boolean;
}
