import { IsString, IsInt } from 'class-validator';

export class CreateCarDto {
  @IsString()
  registrationNumber: string;

  @IsInt()
  userId: number;
}
