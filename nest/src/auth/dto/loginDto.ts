import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'test@test.dk' })
  @IsString()
  email: string;

  @ApiProperty({ example: 'Test12345' })
  @IsString()
  password: string;
}
