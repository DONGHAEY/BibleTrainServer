import { Injectable } from '@nestjs/common';
import { RoleFormat, TrainProfile } from './entity/trainProfile.entity';
import { JoinTrainDto } from './dto/JoinTrain.dto';
import { TrainProfileRepository } from './repository/trainProfile.repository';
import { TrainRepository } from './repository/train.repository';
import { TrainService } from './train.service';

@Injectable()
export class trainMemberService {
  constructor(
    private trainRepository: TrainRepository,
    private trainProfileRepository: TrainProfileRepository,
    private trainService: TrainService,
  ) {}

  async joinTrain(
    userId: number,
    trainId: number,
    { joinKey, nickName }: JoinTrainDto,
    role: RoleFormat,
  ) {
    // 입장 키가 올바른지 성립하는지 확인한다 //
    await this.trainRepository.checkTrainJoinKey(trainId, joinKey);
    // 해당하는 기차에 가입 한다 //
    const profile = await this.trainProfileRepository.createTrainProfile(
      userId,
      trainId,
      nickName,
      role,
    );
    // 해당하는 기차의 인원수를 업데이트한다 //
    await this.updateMemberCountAboutTrain(trainId);
    return profile;
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
    await this.updateMemberCountAboutTrain(trainId);
  }

  async updateMemberCountAboutTrain(trainId: number) {
    const memberCount = await this.trainProfileRepository.getProfileCount(
      trainId,
    );
    await this.trainService.updateMemberCount(trainId, memberCount);
  }

  /** 내 모든 가입된 기차프로필들 불러오기 메서드 */
  async getTrainProfiles(userId: number) {
    const trainProfiles = await this.trainProfileRepository.getTrainProfiles(
      userId,
    );
    return trainProfiles;
  }

  /*/ 특정 기차프로필정보를 반환하는 메서드 /*/
  async getTrainProfile(userId: number, trainId: number) {
    const trainProfile = await this.trainProfileRepository.findOne({
      userId,
      trainId,
    });
    return trainProfile;
  }

  /*/ 특정 기차프로필의 역할을 변경하는 메서드 /*/
  async changeProfileRole(userId: number, trainId: number, role: RoleFormat) {
    const isMember: TrainProfile =
      await this.trainProfileRepository.getTrainProfile(userId, trainId);
    await this.trainProfileRepository.update({ userId, trainId }, { role });
  }

  /*/ 특정 기차에 속해 있는 모든 기차프로필들을 반환한다 /*/
  async getTrainMembersProfiles(trainId: number): Promise<TrainProfile[]> {
    const trainProfiles = await this.trainProfileRepository.find({
      where: {
        trainId: trainId,
      },
    });
    return trainProfiles;
  }

  /** 자신의 기차 프로필 이미지를 변경 및 업데이트 시키는 메서드 */
  async uploadImg(
    userId: number,
    trainId: number,
    files: Express.Multer.File[],
  ): Promise<void> {
    const fileName = `${files[0].filename}`;
    const user = await this.trainProfileRepository.getTrainProfile(
      userId,
      trainId,
    );
    user.profileImage = `/media/userProfiles/${fileName}`;
    await this.trainProfileRepository.update(
      {
        userId,
        trainId,
      },
      user,
    );
  }

  async updateProfileCompleteCount(
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
}
