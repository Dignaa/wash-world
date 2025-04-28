import { IsString, IsNumber } from 'class-validator';

export class CreateLocationDto {
  @IsString()
  address: string;

  @IsNumber()
  x: number;

  @IsNumber()
  y: number;

  @IsString()
  status: string;
}
