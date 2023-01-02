import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AddBibleTrackDto } from './dto/AddBibleTrack.dto';
import { CheckStampRepository } from './repository/check-stamp.repository';
import { BibleTrackRepository } from './repository/bible-track.repository';
import { TrainRepository } from 'src/train/repository/train.repository';
import { TrainService } from 'src/train/train.service';
import { trainMemberService } from 'src/train/train-member.service';

@Injectable()
export class BibleTrackService {
  constructor(
    private trainService: TrainService,
    private trainMemberService: trainMemberService,
    private bibleTrackRepository: BibleTrackRepository,
    private checkStampRepository: CheckStampRepository,
  ) {}

  /*/ 특정 기차의 트랙을 만들기 위한 메서드 /*/
  async createTrack(
    trainId: number,
    addBibleTrackDto: AddBibleTrackDto,
  ): Promise<void> {
    await this.bibleTrackRepository.createTrack(trainId, addBibleTrackDto);
    await this.updateTrackAmountAboutTrain(trainId);
  }

  /*/ 특정 기차의 특정 트랙을 삭제하기 위한 메서드 /*/
  async deleteTrack(trainId: number, trackDate: Date): Promise<any> {
    await this.bibleTrackRepository.delete({ trainId, date: trackDate });
    await this.updateTrackAmountAboutTrain(trainId);
  }

  async updateTrackAmountAboutTrain(trainId: number) {
    const trackAmount = await this.bibleTrackRepository.getTrackCount(trainId);
    await this.trainService.updateTrackAmount(trainId, trackAmount);
  }

  /*/ 트랙에 도착했다고 확인하여 스탬프로 저장하는 메서드 /*/
  async completeTrack(
    trainId: number,
    trackDate: Date,
    userId: number,
  ): Promise<any> {
    await this.checkStampRepository.completeTrack(trainId, trackDate, userId);
    await this.updateTrainProfileAboutCompleteCount(trainId, userId);
  }

  /** 트랙을 달렸음을 취소하여 스탬프를 삭제하는 메서드 */
  async cancelStamp(
    trainId: number,
    trackDate: Date,
    userId: number,
  ): Promise<any> {
    await this.checkStampRepository.delete({ trainId, trackDate, userId });
    await this.updateTrainProfileAboutCompleteCount(trainId, userId);
  }

  async updateTrainProfileAboutCompleteCount(trainId: number, userId: number) {
    const completeCount =
      await this.checkStampRepository.getProfileCompleteCount(trainId, userId);
    await this.trainMemberService.updateProfileCompleteCount(
      trainId,
      userId,
      completeCount,
    );
  }

  /** 특정 트랙의 정보를 반환하는 메서드 */
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

  /** 특정 기차의 특정 기간의 트랙들을 반환하는 메서드 */
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
    return await Promise.all(
      list.map((track) => {
        const userStamp = track.checkStamps.find(
          (stamp) => stamp.userId === userId,
        );
        const newObj = {
          ...track,
          status: userStamp?.status || 'UNCOMPLETE',
        };
        return newObj;
      }),
    );
  }
}
