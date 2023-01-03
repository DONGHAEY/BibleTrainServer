import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TrainModule } from 'src/train/train.module';
import { BibleTrackController } from './bibleTrack.controller';
import { BibleTrackService } from './bibleTrack.service';
import { CheckStampRepository } from './repository/check-stamp.repository';
import { BibleTrackRepository } from './repository/bible-track.repository';

@Module({
  imports: [
    TrainModule,
    TypeOrmModule.forFeature([BibleTrackRepository, CheckStampRepository]),
  ],
  exports: [TypeOrmModule, BibleTrackService],
  controllers: [BibleTrackController],
  providers: [BibleTrackService],
})
export class TrackModule {}
