import { HttpException, HttpStatus } from '@nestjs/common';
import { CheckStamp, STAMPSTAT } from 'src/domain/check-stamp.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(CheckStamp)
export class CheckStampRepository extends Repository<CheckStamp> {
  async completeTrack(
    trainId: number,
    trackDate: string,
    userId: number,
  ): Promise<any> {
    await this.checkExistTrack(trainId, trackDate, userId);
    await this.save({
      trackDate,
      userId,
      trainId,
      status: STAMPSTAT.COMPLETE,
    });
  }

  async getProfileCompleteCount(trainId: number, userId: number) {
    return await this.count({ trainId, userId, status: STAMPSTAT.COMPLETE });
  }

  private async checkExistTrack(
    trainId: number,
    trackDate: string,
    userId: number,
  ) {
    const checkStamp: CheckStamp = await this.findOne({
      trainId,
      trackDate,
      userId,
    });
    if (checkStamp) {
      throw new HttpException(
        '이미 같은 날의 스탬프가 존재합니다',
        HttpStatus.FOUND,
      );
    }
    return checkStamp;
  }
}
