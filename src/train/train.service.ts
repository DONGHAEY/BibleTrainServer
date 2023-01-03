import { Injectable } from '@nestjs/common';
import { Train } from './entity/train.entity';
import { TrainRepository } from './repository/train.repository';

@Injectable()
export class TrainService {
  constructor(private trainRepository: TrainRepository) {}

  /** 기차를 생성하는 메서드 */
  async createTrainAndJoin(trainName: string, userId: number): Promise<Train> {
    const train: Train = await this.trainRepository.createTrain(
      trainName,
      userId,
    );
    return train;
  }

  async getTrainJoinKey(trainId: number) {
    return await this.trainRepository.getTrainJoinKey(trainId);
  }

  /** 특정 기차정보를 반환하는 메서드 */
  async getTrain(trainId: number): Promise<Train> {
    return await this.trainRepository.getTrainById(trainId);
  }

  /** 특정 기차를 삭제하는 메서드 (CASCADE 속성으로 기차 아래 속해있는 모든것이 지워짐) */
  async deleteTrain(trainId: number): Promise<void> {
    await this.trainRepository.delete({
      id: trainId,
    });
  }

  /** 기차테이블에 있는 기차멤버수 컬럼을 업데이트 시키는 메서드 */
  async updateMemberCount(trainId: number, memberCount: number) {
    await this.trainRepository.update({ id: trainId }, { memberCount });
  }

  /** 자신의 기차 트랙수 컬럼을 업데이트 시키는 메서드 */
  async updateTrackAmount(trainId: number, trackAmount: number) {
    await this.trainRepository.update(
      {
        id: trainId,
      },
      {
        trackAmount,
      },
    );
  }
}
