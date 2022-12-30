import {
  ConflictException,
  HttpException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { randomBytes } from 'crypto';
import { TrainProfile } from 'src/domain/train-profile.entity';
import { Train } from 'src/domain/train.entitiy';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(Train)
export class TrainRepository extends Repository<Train> {
  async createTrain(trainName: string, userId: number): Promise<Train> {
    const isSameName = await this.findOne({ where: { trainName } });
    if (isSameName) {
      throw new HttpException(
        '똑같은 열차 이름이 존재합니다.',
        HttpStatus.BAD_REQUEST,
      );
      // throw new ConflictException('똑같은 열차 이름이 존재합니다.');
    }

    const joinKey = randomBytes(4).toString('hex');
    while (true) {
      const isSameKey = await this.findOneByJoinKey(joinKey);
      if (!isSameKey) {
        break;
      }
    }
    const train = await this.save({
      joinKey,
      trainName,
      captain: userId,
    });
    return train;
  }

  async updateTrackAmount(trainId: number, trackAmount: number) {
    await this.query(
      `update train set track_amount=${trackAmount} where id=${trainId}`,
    );
  }

  async getTrainJoinKey(trainId: number): Promise<string> {
    const trainInfo: Train = await this.findOne({
      select: ['joinKey'],
      where: { id: trainId },
    });
    if (!trainInfo) {
      throw new NotFoundException(`#${trainId}번 기차는 존재하지 않습니다`);
    }
    return trainInfo.joinKey;
  }

  async checkTrainJoinKey(trainId: number, joinkey: string): Promise<void> {
    const trainJoinKey = await this.getTrainJoinKey(trainId);
    if (trainJoinKey !== joinkey) {
      throw new HttpException(
        '입장하려는 기차의 인증코드가 올바르지 않습니다',
        HttpStatus.BAD_REQUEST,
      );
    }
    return;
  }

  async getTrainById(trainId: number): Promise<Train> {
    const trainInfo: Train = await this.findOne(trainId);
    if (!trainInfo) {
      throw new NotFoundException(`#${trainId}번 기차는 존재하지 않습니다`);
    }
    return trainInfo;
  }

  private async findOneByJoinKey(joinKey: string): Promise<Train> {
    const trainInfo: Train = await this.findOne({
      joinKey,
    });
    return trainInfo;
  }
}
