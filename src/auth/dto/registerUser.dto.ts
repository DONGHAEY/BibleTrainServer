import { IsNotEmpty } from 'class-validator';
import { UserDto } from './user.dto';

export class RegisterUserDto extends UserDto {
  @IsNotEmpty()
  email: string;
}
