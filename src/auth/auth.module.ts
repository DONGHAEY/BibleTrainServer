import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserRepository } from './repository/user.repository';
import { UserService } from './user.service';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './security/jwt.strategy';
import { AuthGuard } from './security/auth.guard';
import { TokenRepository } from './repository/token.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserRepository, TokenRepository]),
    JwtModule.register({
      secret: 'SECRET_KEY',
    }),
    PassportModule,
  ],
  exports: [TypeOrmModule],
  controllers: [AuthController],
  providers: [AuthService, UserService, JwtStrategy],
})
export class AuthModule {}
