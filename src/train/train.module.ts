import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TrainController } from './train.controller';
import { TrainService } from './train.service';
import { TrainRepository } from './repository/train.repository';
import { TrainProfileRepository } from './repository/trainProfile.repository';
import { trainMemberService } from './train-member.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([TrainRepository, TrainProfileRepository]),
  ],
  exports: [TypeOrmModule, TrainService, trainMemberService],
  controllers: [TrainController],
  providers: [TrainService, trainMemberService],
})
export class TrainModule {}
