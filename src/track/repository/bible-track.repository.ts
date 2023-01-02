import { HttpException, HttpStatus, NotFoundException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { BibleTrack } from 'src/domain/bible-track.entity';
import { CheckStamp } from 'src/domain/check-stamp.entity';
import { Between, EntityRepository, Repository } from 'typeorm';
import { AddBibleTrackDto } from '../dto/AddBibleTrack.dto';

@EntityRepository(BibleTrack)
export class BibleTrackRepository extends Repository<BibleTrack> {
  async createTrack(
    trainId: number,
    addBibleTrackDto: AddBibleTrackDto,
  ): Promise<void> {
    await this.checkExistTrack(trainId, addBibleTrackDto.date);
    await this.save({
      trainId,
      ...addBibleTrackDto,
    });
  }

  async findOneTrack(trainId: number, trackDate: Date) {
    return await this.findOne({
      where: {
        trainId,
        date: trackDate,
      },
      relations: ['checkStamps'],
    });
  }

  async findAllTracks(trainId: number, startDate, endDate) {
    const bibleTracks = await this.find({
      where: {
        trainId,
        date: Between(startDate, endDate),
      },
      relations: ['checkStamps'],
      order: {
        date: 'ASC',
      },
    });
    return bibleTracks;
  }

  async getTrackCount(trainId: number) {
    return await this.count({
      trainId,
    });
  }

  private async checkExistTrack(trainId: number, date: Date) {
    const bibleTrack: BibleTrack = await this.findOne({ trainId, date });
    if (bibleTrack) {
      throw new HttpException(
        '같은 pk로 존재하는 트랙이 있습니다',
        HttpStatus.FOUND,
      );
    }
  }
}
