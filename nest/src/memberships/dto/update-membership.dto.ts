import { ApiProperty } from '@nestjs/swagger';

export class UpdateMembershipDto {
  @ApiProperty({ example: '2025-01-01T00:00:00Z' })
  start: Date;

  @ApiProperty({ example: '2025-12-31T23:59:59Z' })
  end: Date;

  @ApiProperty({ example: 2 })
  locationId: number;

  @ApiProperty({ example: 2 })
  typeId: number;

  @ApiProperty({ example: 1 })
  carId: number;

  @ApiProperty({ example: 1 })
  userId: number;
}
