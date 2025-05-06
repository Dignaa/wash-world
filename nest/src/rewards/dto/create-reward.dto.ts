import { ApiProperty } from '@nestjs/swagger';

export class CreateRewardDto {
  @ApiProperty({ example: 'Free Wash' })
  name: string;

  @ApiProperty({ example: '2025-12-31T23:59:59.000Z' })
  expiryDate: Date;

  @ApiProperty({ example: false })
  isRedeemed: boolean;

  @ApiProperty({ example: 1 })
  userId: number;
}
