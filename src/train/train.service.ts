import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoleFormat, TrainProfile } from 'src/domain/train-profile.entity';
import { Train } from 'src/domain/train.entitiy';
import { BibleTrackRepository } from 'src/track/repository/bible-track.repository';
import { JoinTrainDto } from './dto/JoinTrain.dto';
import { MakeTrainDto } from './dto/MakeTrain.dto';
import { TrainProfileRepository } from './repository/train-profile.repository';
import { TrainRepository } from './repository/train.repository';

@Injectable()
export class TrainService {
  constructor(
    @InjectRepository(TrainRepository) private trainRepository: TrainRepository,
    @InjectRepository(TrainProfileRepository)
    private trainProfileRepository: TrainProfileRepository,
    @InjectRepository(BibleTrackRepository)
    private bibleTrackRepository: BibleTrackRepository,
  ) {}

  /*/ 기차를 생성하는 메서드 /*/
  async createTrain(
    trainName: string,
    userId: number,
    makeTrainDto: MakeTrainDto,
  ): Promise<Train> {
    const train: Train = await this.trainRepository.createTrain(
      trainName,
      userId,
    );
    console.log(train);
    const joinTrainDto: JoinTrainDto = {
      nickName: makeTrainDto.captainName,
      joinKey: train.joinKey,
    };
    const captainProfile: TrainProfile = await this.joinTrain(
      userId,
      train.id,
      joinTrainDto,
      RoleFormat.CAPTAIN,
    );
    return train;
  }

  /*/ 기차를 가입하는 메서드 /*/
  async joinTrain(
    userId: number,
    trainId: number,
    { joinKey, nickName }: JoinTrainDto,
    role: RoleFormat,
  ) {
    await this.trainRepository.checkTrainJoinKey(trainId, joinKey);
    console.log(userId, trainId, nickName, role);
    const profile = await this.trainProfileRepository.createTrainProfile(
      userId,
      trainId,
      nickName,
      role,
    );
    await this.updateMemberCount(trainId);
    return profile;
  }

  async updateCompleteCountInProfile(
    trainId: number,
    userId: number,
    completeCount: number,
  ) {
    await this.trainProfileRepository.update(
      {
        trainId,
        userId,
      },
      {
        completeCount,
      },
    );
  }

  /*/ 내 모든 가입된 기차프로필들 불러오기 메서드 /*/
  async getUserTrainProfiles(userId: number) {
    const trainProfiles = await this.trainProfileRepository.getTrainProfiles(
      userId,
    );
    return trainProfiles;
  }

  async getTrainJoinKey(trainId: number) {
    return await this.trainRepository.getTrainJoinKey(trainId);
  }

  /*/ 특정 기차프로필정보를 반환하는 메서드 /*/
  async getTrainProfile(userId: number, trainId: number) {
    const trainProfile = await this.trainProfileRepository.findOne({
      userId,
      trainId,
    });
    trainProfile.profileImage =
      'http://172.30.1.19:8000/media/userProfiles/' + trainProfile.profileImage;
    return trainProfile;
  }

  /*/ 특정 기차프로필의 역할을 변경하는 메서드 /*/
  async changeProfileRole(userId: number, trainId: number, role: RoleFormat) {
    const isMember: TrainProfile =
      await this.trainProfileRepository.getTrainProfile(userId, trainId);
    await this.trainProfileRepository.update({ userId, trainId }, { role });
  }

  /*/ 기차를 탈퇴하는 메서드 /*/
  async deleteTrainProfile(userId: number, trainId: number) {
    const member: TrainProfile = await this.trainProfileRepository.findOne({
      userId,
      trainId,
    });
    await this.trainProfileRepository.delete({
      userId: member.userId,
      trainId,
    }); //db의 cascade속성으로 stamp가 다 같이 사라진다.
    await this.updateMemberCount(trainId);
  }

  /*/ 특정 기차정보를 반환하는 메서드 /*/
  async getTrain(trainId: number): Promise<Train> {
    return await this.trainRepository.getTrainById(trainId);
  }

  /*/ 특정 기차에 속해 있는 모든 기차프로필들을 반환한다 /*/
  async getTrainMembersProfiles(trainId: number): Promise<TrainProfile[]> {
    const trainProfiles = await this.trainProfileRepository.find({
      where: {
        trainId: trainId,
      },
    });
    await Promise.all(
      trainProfiles.map((profile) => {
        profile.profileImage =
          'http://172.30.1.19:8000/media/userProfiles/' + profile.profileImage;
      }),
    );
    return trainProfiles;
  }

  /*/ 기차테이블에 있는 기차멤버수 컬럼을 업데이트 시키는 메서드 /*/
  async updateMemberCount(trainId: number) {
    const profileCount = await this.trainProfileRepository.getProfileCount(
      trainId,
    );
    await this.trainRepository.update(
      { id: trainId },
      { memberCount: profileCount },
    );
  }

  /*/ 자신의 기차 트랙수 컬럼을 업데이트 시키는 메서드 /*/
  async updateTrackAmount(trainId: number) {
    const amount = await this.bibleTrackRepository.getTrackAmount(trainId);
    await this.trainRepository.updateTrackAmount(trainId, amount);
  }

  /*/ 자신의 기차 프로필 이미지를 변경시키는 메서드 /*/
  async uploadImg(
    userId: number,
    trainId: number,
    files: Express.Multer.File[],
  ) {
    const fileName = `${files[0].filename}`;
    await this.trainProfileRepository.updateImg(userId, trainId, fileName);
  }

  /*/ 특정 기차를 삭제하는 메서드 /*/
  async deleteTrain(trainId: number) {
    await this.trainRepository.delete({
      id: trainId,
    });
  }
}
