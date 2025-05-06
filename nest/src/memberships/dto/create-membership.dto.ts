import { ApiProperty } from '@nestjs/swagger';

export class CreateMembershipDto {
  @ApiProperty({ example: '2025-01-01T00:00:00.000Z' })
  start: Date;

  @ApiProperty({ example: '2025-12-31T23:59:59.000Z' })
  end: Date;

  @ApiProperty({ example: 'Premium' })
  type: 'gold' | 'premium' | 'brilliant';

  @ApiProperty({ example: 1 })
  userId: number;
}
