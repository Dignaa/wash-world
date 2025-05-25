import { ApiProperty } from '@nestjs/swagger';

export class CreateWashDto {
  @ApiProperty({ example: 1 })
  carId?: number;

  @ApiProperty({ example: 'AB1234' })
  licensePlate?: string;

  @ApiProperty({ example: 1 })
  userId?: number;

  @ApiProperty({ example: 2 })
  locationId: number;

  @ApiProperty({ example: 4.5, required: false })
  rating?: number;

  @ApiProperty({ example: 2 })
  washTypeId: number;

  @ApiProperty({ example: false })
  emergencyStop: boolean;
}
