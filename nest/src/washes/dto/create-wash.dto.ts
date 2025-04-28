import { IsInt, IsDateString, IsNumber, IsBoolean, IsOptional } from 'class-validator';

export class CreateWashDto {
  @IsInt()
  carId: number;

  @IsInt()
  userId: number;

  @IsInt()
  locationId: number;

  @IsDateString()
  time: Date;

  @IsOptional()
  @IsNumber()
  rating?: number;

  @IsBoolean()
  emergencyStop: boolean;
}
