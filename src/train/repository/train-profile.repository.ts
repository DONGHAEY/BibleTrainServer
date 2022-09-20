import { HttpException, HttpStatus, Ip } from "@nestjs/common";
import { RoleFormat, TrainProfile } from "src/domain/train-profile.entity";
import {  EntityRepository, Repository } from "typeorm";

@EntityRepository(TrainProfile)
export class TrainProfileRepository extends Repository<TrainProfile> { 

    async createTrainProfile(userId : number, trainId : number, name : string, role : RoleFormat) : Promise<TrainProfile> {
        const isMember : TrainProfile = await this.findOne({userId, trainId});
        if(isMember) {
            throw new HttpException('이미 기차에 탑승되어있습니다', HttpStatus.FORBIDDEN)
        }
        return await this.save({
            userId,
            trainId,
            nickName : name,
            role
        });
    }

    async getTrainProfile(userId:number, trainId:number) : Promise<TrainProfile> {
        const Member : TrainProfile = await this.findOne({userId, trainId});
        if(!Member) {
            throw new HttpException('(userId, trainId)를 기본키로 가진 member를 찾을 수 없습니다', HttpStatus.NOT_FOUND)
        }
        return Member;
    }
    
    async getTrainProfiles(userId : number) : Promise<TrainProfile[]> {
        return await this.find({
            where : {
                userId,
            },
            relations : ['train']
        })
    }

    async getProfileCount(trainId: number) : Promise<{profile_count : number}> {
        return await this.createQueryBuilder('train_profile')
        .select('COUNT(*) AS profile_count').groupBy('train_profile.train_id').where(`train_id = ${trainId}`).getRawOne(); //profileCount로 고치기
    }


    async findByIdAndUpdateImg(userId:number, trainId:number, fileName : string) {
        const user = await this.findOne({
            userId,
            trainId,
        })
        user.profileImage = `http://localhost:8000/media/${fileName}`;
        const nuser = await this.update({
            userId,
            trainId
        }, user);
        return nuser;
    }
}