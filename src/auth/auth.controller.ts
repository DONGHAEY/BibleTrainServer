import {
  Body,
  Controller,
  Post,
  Req,
  Res,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { Request } from 'express';
import { UserDto } from './dto/user.dto';
import { AuthGuard } from './security/auth.guard';
import { RegisterUserDto } from './dto/registerUser.dto';
import { GetUser } from './decorator/userinfo.decorator';
import { User } from 'src/user/entity/user.entity';

@Controller('/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/register')
  @UsePipes(ValidationPipe)
  async registerAccount(
    @Req() req: Request,
    @Body() userDto: RegisterUserDto,
  ): Promise<any> {
    return await this.authService.registerUser(userDto);
  }

  @Post('/login')
  async login(@Body() userDto: UserDto, @Res() res: Response): Promise<any> {
    await this.authService.login(res, userDto);
  }

  @Post('/logout')
  logout(@Res() res: Response): any {
    this.authService.logout(res);
  }

  @Post('/authenticate')
  @UseGuards(AuthGuard)
  isAuthenticated(@GetUser() user: User): any {
    return {
      user,
      success: true,
    };
  }
}
