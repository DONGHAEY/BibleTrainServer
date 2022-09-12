import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoleFormat, TrainProfile } from 'src/domain/train-profile.entity';
import { Train } from 'src/domain/train.entitiy';
import { User } from 'src/domain/user.entity';
import { BibleTrackRepository } from 'src/track/repository/bible-track.repository';
import { CheckStampRepository } from 'src/track/repository/check-stamp.repository';
import { JoinTrainDto } from './dto/JoinTrain.dto';
import { MakeTrainDto } from './dto/MakeTrain.dto';
import { TrainProfileRepository } from './repository/train-profile.repository';
import { TrainRepository } from './repository/train.repository';

@Injectable()
export class TrainService {
    constructor(
        @InjectRepository(TrainRepository) private trainRepository: TrainRepository,
        @InjectRepository(TrainProfileRepository) private trainProfileRepository : TrainProfileRepository,
        // @InjectRepository(TrainProfileRepository) private checkStampRepository : CheckStampRepository,
        // @InjectRepository(BibleTrackRepository) private bibleTrackRepository : BibleTrackRepository
    ) {}

    async createTrain(trainName : string, userId:number, makeTrainDto:MakeTrainDto) : Promise<Train> {
        const train : Train = await this.trainRepository.createTrain(trainName, userId);
        const joinTrainDto : JoinTrainDto = {
            nickName : makeTrainDto.captainName,
            joinKey : train.joinKey
        }
        const captainProfile :TrainProfile = await this.joinTrain(userId, train.id, joinTrainDto, RoleFormat.CAPTAIN);
        return train;
    }

    async joinTrain(userId : number, trainId:number, {joinKey, nickName}:JoinTrainDto, role: RoleFormat)
    {
        const isTrue : boolean = await this.trainRepository.checkTrainJoinKey(trainId, joinKey);
        if(!isTrue) {
            throw new HttpException('입장하려는 기차의 인증코드가 올바르지 않습니다', HttpStatus.BAD_REQUEST);
        }

        const profile = await this.trainProfileRepository.createTrainProfile(userId, trainId, nickName, role);
        await this.updateMemberCount(trainId);
        return profile;
    }

    async getTrainProfiles(userId : number) {
        return await this.trainProfileRepository.getTrainProfiles(userId);
    }

    async getTrainProfile(userId:number, trainId:number) {
        const trainProfile = await this.trainProfileRepository.findOne({
            userId,
            trainId
        }, {
            relations:['checkStamps', 'checkStamps.track'] //2중 조인 까지 할 필요 없음
        });
        return trainProfile;
    }

    async changeProfileRole(userId:number, trainId:number, role:RoleFormat) {
        const isMember : TrainProfile = await this.trainProfileRepository.getTrainProfile(userId, trainId);
        await this.trainProfileRepository.update({userId,trainId}, {role});
    }

    // async deleteTrainProfile(userId:number, trainId:number) {
    //     const member : TrainProfile = await this.trainProfileRepository.findOne({userId, trainId}, {relations:['checkStamps']});
    //     await this.trainProfileRepository.delete({userId: member.userId, trainId});
    //     member.checkStamps.map(async stamp => {
    //         const trackCheckStampAmount = await this.checkStampRepository.getTrackCheckStampAmount(trainId, `${stamp.trackDate.getFullYear()}.${stamp.trackDate.getMonth()+1}.${stamp.trackDate.getDate()}`);
    //         await this.bibleTrackRepository.updateCompletedAmount(trainId, `${stamp.trackDate.getFullYear()}.${stamp.trackDate.getMonth()+1}.${stamp.trackDate.getDate()}`, trackCheckStampAmount);
    //     })
    //     await this.updateMemberCount(trainId);
    // }

    async getTrain(trainId : number) : Promise<Train> {
        return await this.trainRepository.getTrainById(trainId);
    }

    async getTrainMembersProfiles(trainId : number) : Promise<TrainProfile[]> {
        return await this.trainProfileRepository.find({
            trainId:trainId
        });
    }

    async updateMemberCount(trainId : number) {
        const { profile_count } = await this.trainProfileRepository.getProfileCount(trainId);
        await this.trainRepository.update({id:trainId}, {memberCount:profile_count});
    }

    async uploadImg(userId : number, trainId: number, files : Express.Multer.File[]) {
        const fileName = `${files[0].filename}`;
        console.log(fileName);
        await this.trainProfileRepository.findByIdAndUpdateImg(userId, trainId, 'userProfiles/'+fileName);
    }
}