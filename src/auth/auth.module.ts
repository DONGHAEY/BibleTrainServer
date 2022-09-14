import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserRepository } from './repository/user.repository';
import { UserService } from './user.service';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './security/passport.jwt.strategy';
import { UserAuthorityRepository } from './repository/user-authority.repository';
import { AuthGuard } from './security/auth.guard';

@Module({
  imports : [
    TypeOrmModule.forFeature([UserRepository, UserAuthorityRepository]),
    JwtModule.register({
      secret : 'SECRET_KEY',
      signOptions : {expiresIn : '1000s'}
    }),
    PassportModule,
  ],
  exports : [TypeOrmModule],
  controllers: [AuthController],
  providers: [AuthService, UserService, JwtStrategy]
})
export class AuthModule {}