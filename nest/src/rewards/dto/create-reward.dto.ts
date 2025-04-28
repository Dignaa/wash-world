import { IsString, IsDateString, IsBoolean, IsInt } from 'class-validator';

export class CreateRewardDto {
  @IsString()
  name: string;

  @IsDateString()
  expiryDate: Date;

  @IsBoolean()
  isRedeemed: boolean;

  @IsInt()
  userId: number;
}
