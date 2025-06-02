import { IsDateString } from 'class-validator';

export class ExtendMembershipDto {
  @IsDateString()
  newEndDate: string;
}
