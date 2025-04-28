import { IsString, IsEmail, IsPhoneNumber } from 'class-validator';

export class CreateUserDto {
  @IsString()
  name: string;

  @IsPhoneNumber()
  phoneNumber: string;

  @IsEmail()
  emailAddress: string;
}
