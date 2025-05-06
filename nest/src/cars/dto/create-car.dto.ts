import { ApiProperty } from '@nestjs/swagger';

export class CreateCarDto {
  @ApiProperty({ example: 'XYZ-1234' })
  registrationNumber: string;

  @ApiProperty({ example: 1, description: 'User ID who owns the car' })
  userId: number;
}
