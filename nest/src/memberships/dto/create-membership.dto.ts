import { IsDateString, IsString, IsInt } from 'class-validator';

export class CreateMembershipDto {
  @IsDateString()
  start: Date;

  @IsDateString()
  end: Date;

  @IsString()
  type: string;

  @IsInt()
  userId: number;
}
