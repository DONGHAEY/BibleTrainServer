import { HttpException, HttpStatus } from '@nestjs/common';
import { CheckStamp, STAMPSTAT } from 'src/domain/check-stamp.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(CheckStamp)
export class CheckStampRepository extends Repository<CheckStamp> {
  async completeTrack(
    trainId: number,
    trackDate: Date,
    userId: number,
  ): Promise<any> {
    // 이미 완료 했는데 다시 완료하는 것을 막는다. //
    await this.checkExistTrack(trainId, trackDate, userId);
    await this.save({
      trackDate,
      userId,
      trainId,
      status: STAMPSTAT.COMPLETE,
    });
  }

  async getProfileCompleteCount(trainId: number, userId: number) {
    return await this.count({
      trainId,
      userId,
      status: STAMPSTAT.COMPLETE,
    });
  }

  private async checkExistTrack(
    trainId: number,
    trackDate: Date,
    userId: number,
  ) {
    const checkStamp: CheckStamp = await this.findOne({
      trainId,
      trackDate,
      userId,
    });
    if (checkStamp) {
      throw new HttpException('스탬프가 이미 존재합니다', HttpStatus.FOUND);
    }
    return checkStamp;
  }
}
