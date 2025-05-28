import { IsInt, IsNotEmpty } from 'class-validator'

export class UpgradeMembershipDto {
  @IsInt()
  @IsNotEmpty()
  newTypeId: number
}
