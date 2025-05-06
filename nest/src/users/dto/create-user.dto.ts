import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'Alice Johnson' })
  name: string;

  @ApiProperty({ example: '+1234567890' })
  phoneNumber: string;

  @ApiProperty({ example: 'alice@example.com' })
  emailAddress: string;
}
