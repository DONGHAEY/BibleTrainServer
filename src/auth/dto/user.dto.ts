import { IsNotEmpty } from 'class-validator';

export class UserDto {
  @IsNotEmpty()
  username: string;
  @IsNotEmpty()
  password: string;
}
