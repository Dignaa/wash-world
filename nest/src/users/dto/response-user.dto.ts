import { Exclude, Expose } from 'class-transformer';

export class ResponseUserDto {
  @Exclude()
  password: string;
}
