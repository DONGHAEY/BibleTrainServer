import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AddBibleTrackDto } from './dto/AddBibleTrack.dto';
import { CheckStampRepository } from './repository/check-stamp.repository';
import { BibleTrackRepository } from './repository/bible-track.repository';
import { TrainRepository } from 'src/train/repository/train.repository';
import { TrainService } from 'src/train/train.service';

@Injectable()
export class BibleTrackService {
  constructor(
    @InjectRepository(TrainRepository) private trainRepository: TrainRepository,
    @InjectRepository(BibleTrackRepository)
    private bibleTrackRepository: BibleTrackRepository,
    @InjectRepository(CheckStampRepository)
    private checkStampRepository: CheckStampRepository,
    private trainService: TrainService,
  ) {}

  /*/ 특정 기차의 트랙을 만들기 위한 메서드 /*/
  async createTrack(
    trainId: number,
    addBibleTrackDto: AddBibleTrackDto,
  ): Promise<void> {
    await this.bibleTrackRepository.createTrack(trainId, addBibleTrackDto);
    await this.trainService.updateTrackAmount(trainId);
  }

  /*/ 특정 기차의 특정 트랙을 삭제하기 위한 메서드 /*/
  async deleteTrack(
    trainId: number,
    trackDate: string,
    userId: number,
  ): Promise<any> {
    await this.checkIsExsisting(trainId, trackDate);
    await this.bibleTrackRepository.delete({ trainId, date: trackDate });
    await this.trainService.updateTrackAmount(trainId);
  }

  /*/ 트랙에 도착했다고 확인하여 스탬프로 저장하는 메서드 /*/
  async completeTrack(
    trainId: number,
    trackDate: string,
    userId: number,
  ): Promise<any> {
    // 비슷한 부분 함수로 처리하기
    await this.checkIsExsisting(trainId, trackDate);
    await this.checkStampRepository.completeTrack(trainId, trackDate, userId);
  }

  async checkIsExsisting(trainId: number, trackDate) {
    const trackInfo = await this.bibleTrackRepository.findOneTrack(
      trainId,
      trackDate,
    );
    if (!trackInfo) {
      throw new HttpException('존재하지 않는 트랙입니다', HttpStatus.NOT_FOUND);
    }
  }

  /*/ 트랙을 달렸음을 취소하여 스탬프를 삭제하는 메서드 /*/
  async cancelStamp(
    trainId: number,
    trackDate: string,
    userId: number,
  ): Promise<any> {
    // 비슷한 부분 함수로 처리하기
    await this.checkIsExsisting(trainId, trackDate);
    await this.checkStampRepository.delete({ trainId, trackDate, userId });
  }

  /*/ 특정 트랙의 정보를 반환하는 메서드 /*/
  async getTrackInfo(
    trainId: number,
    date: Date,
    userId: number,
  ): Promise<any> {
    const track = await this.bibleTrackRepository.findOneTrack(trainId, date);
    const userStamp =
      track.checkStamps && track.checkStamps.length
        ? track.checkStamps.find((stamp) => stamp.userId === userId)
        : null;
    const newObj = {
      ...track,
      status: null,
    };
    newObj.status =
      userStamp && userStamp.status ? userStamp.status : 'UNCOMPLETE';
    return newObj;
  }

  /*/ 특정 기차의 모든 트랙들을 반환하는 메서드 /*/
  //페이지네이션 기능 추가예정
  async getTrackList(
    trainId: number,
    userId: number,
    startDate: string,
    endDate: string,
  ): Promise<any> {
    const list = await this.bibleTrackRepository.findAllTracks(
      trainId,
      startDate,
      endDate,
    );
    return list.map((track) => {
      const userStamp =
        track.checkStamps && track.checkStamps.length
          ? track.checkStamps.find((stamp) => stamp.userId === userId)
          : null;
      const newObj = {
        ...track,
        status: userStamp && userStamp.status ? userStamp.status : 'UNCOMPLETE',
      };
      return newObj;
    });
  }

  async getTrackListWidthPeriod(
    trainId: number,
    startDate: Date,
    endDate: Date,
  ) {
    return await this.bibleTrackRepository.findPeriodTracks(
      trainId,
      startDate,
      endDate,
    );
  }
}
