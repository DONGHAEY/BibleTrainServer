import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { UserRepository } from 'src/auth/repository/user.repository';
import { AuthGuard } from 'src/auth/security/auth.guard';
import { JwtStrategy } from 'src/auth/security/passport.jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { UserAuthority } from 'src/domain/user-authority.entity';
import { JwtModule } from '@nestjs/jwt';
import { TrainController } from './train.controller';
import { TrainService } from './train.service';
import { AuthService } from 'src/auth/auth.service';
import { TrainRepository } from './repository/train.repository';
import { TrainProfileRepository } from './repository/train-profile.repository';

@Module({
  imports : [
    TypeOrmModule.forFeature([TrainRepository, TrainProfileRepository]),
  ],
  exports : [TypeOrmModule, TrainService],
  controllers: [TrainController],
  providers: [TrainService]
})
export class TrainModule {}