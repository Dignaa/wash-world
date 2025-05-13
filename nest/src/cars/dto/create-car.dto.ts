import { ApiProperty } from '@nestjs/swagger';

export class CreateCarDto {
  @ApiProperty({ example: 'XYZ-1234' })
  registrationNumber: string;
}
