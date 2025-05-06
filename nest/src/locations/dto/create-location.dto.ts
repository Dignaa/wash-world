import { ApiProperty } from '@nestjs/swagger';

export class CreateLocationDto {
  @ApiProperty({ example: '123 Main St, Springfield' })
  address: string;

  @ApiProperty({ example: 40.7128 })
  x: number;

  @ApiProperty({ example: -74.006 })
  y: number;

  @ApiProperty({ example: 'active', enum: ['active', 'inactive'] })
  status: string;
}
