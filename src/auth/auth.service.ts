import { HttpException, HttpStatus, Injectable, Res } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { randomBytes } from 'crypto';
import { Response } from 'express';
import { Token } from './entity/token.entity';
import { User } from 'src/user/entity/user.entity';
import { TokenRepository } from './repository/token.repository';
import { RegisterUserDto } from './dto/registerUser.dto';
import { UserDto } from './dto/user.dto';
import { UserService } from 'src/user/user.service';
@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
    private tokenRepository: TokenRepository,
  ) {}

  async registerUser(newUser: RegisterUserDto) {
    let userFind: User =
      (await this.userService.findByFields({
        where: { username: newUser.username },
      })) ||
      (await this.userService.findByFields({
        where: { email: newUser.email },
      }));
    if (userFind) {
      throw new HttpException(
        'username 또는 이메일이 이미 사용중입니다!',
        HttpStatus.BAD_REQUEST,
      );
    }
    await this.userService.save(newUser);
  }

  async login(@Res() res: Response, userDto: UserDto) {
    const user = await this.userService.validateUser(userDto);
    const token = this.jwtService.sign(
      { ...user },
      {
        secret: process.env.SECRET_KEY,
        algorithm: 'HS256',
        expiresIn: '1h',
      },
    );
    const refreshToken = this.jwtService.sign(
      {
        refreshToken: (await this.createToken(user.id)).token,
      },
      {
        secret: process.env.SECRET_KEY,
        algorithm: 'HS256',
        expiresIn: '5d',
      },
    );
    res.cookie('token', token, {
      path: '/',
      httpOnly: true,
      maxAge: 1000 * 60 * 60,
    });
    res.cookie('refreshToken', refreshToken, {
      path: '/',
      httpOnly: true,
      maxAge: 24 * 60 * 1000 * 60 * 5,
    });
    res.json({
      success: true,
    });
  }

  async logout(@Res() res: Response): Promise<void> {
    res.cookie('token', null, {
      path: '/',
      httpOnly: true,
      maxAge: 0,
    });
    res.cookie('refreshToken', null, {
      path: '/',
      httpOnly: true,
      maxAge: 0,
    });
    res.json({
      success: true,
    });
  }

  private async createToken(userId: number): Promise<Token> {
    const refreshToken = new Token();
    refreshToken.token = randomBytes(64).toString('hex');
    refreshToken.userId = userId;
    refreshToken.valid = true;
    refreshToken.createdAt = new Date();
    await this.tokenRepository.save(refreshToken);
    return refreshToken;
  }
}
