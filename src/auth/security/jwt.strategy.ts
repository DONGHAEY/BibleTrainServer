import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy, VerifiedCallback } from 'passport-jwt';
import { AuthService } from '../auth.service';
import { Payload } from './payload.interface';
import { Request } from 'express';
import { User } from 'src/domain/user.entity';
import { TokenRepository } from '../repository/token.repository';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { Token } from 'src/domain/token.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private tokenRepository: TokenRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          return req?.cookies?.token || req?.cookies?.refreshToken;
        },
      ]),
      secretOrKey: 'SECRET_KEY',
      passReqToCallback: true,
    });
  }

  async validate(req: Request, user: User): Promise<User> {
    if (user.id) {
      const userInfo: User = await this.userService.findById(user.id);
      return userInfo;
    }
    const { refreshToken } = this.jwtService.verify(
      req?.cookies?.refreshToken,
      { secret: process.env.SECRET_KEY },
    );
    if (refreshToken === undefined) {
      throw new UnauthorizedException();
    }
    const tokenInfo = await this.getRecentToken(refreshToken);
    if (tokenInfo === null) {
      throw new UnauthorizedException();
    }
    const passedTime = new Date().getTime() - tokenInfo.createdAt.getTime();
    console.log(passedTime);
    if (passedTime > 24 * 60 * 1000 * 60 * 1) {
      throw new UnauthorizedException('refreshToken은 이미 만료되었습니다');
    }
    const userInfo: User = await this.userService.findById(tokenInfo.userId);
    if (userInfo === null) {
      throw new UnauthorizedException();
    }
    const token = this.jwtService.sign(
      { ...userInfo },
      {
        secret: 'SECRET_KEY',
        algorithm: 'HS256',
        expiresIn: '1h',
      },
    );
    req.res.cookie('token', token, {
      path: '/',
      httpOnly: true,
      maxAge: 1000 * 60 * 60,
    });
    return userInfo;
  }

  private async getRecentToken(token: string): Promise<Token | null> {
    return await this.tokenRepository.findOne({
      where: {
        token,
      },
      order: {
        createdAt: 'DESC',
      },
    });
  }
}

// npm install --save @nestjs/passport passport passport-local
// $ npm install --save-dev @types/passport-local
