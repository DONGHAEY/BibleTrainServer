import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { STAMPSTAT } from 'src/domain/check-stamp.entity';
import { AddBibleTrackDto } from './dto/AddBibleTrack.dto';
import { CheckStampRepository } from './repository/check-stamp.repository';
import { BibleTrackRepository } from './repository/bible-track.repository';
import { TrainRepository } from 'src/train/repository/train.repository';
import { TrainProfileRepository } from 'src/train/repository/train-profile.repository';

@Injectable()
export class BibleTrackService {
    constructor(
        @InjectRepository(TrainRepository) private trainRepository : TrainRepository,
        @InjectRepository(BibleTrackRepository) private bibleTrackRepository : BibleTrackRepository,
        @InjectRepository(CheckStampRepository) private checkStampRepository : CheckStampRepository,
        @InjectRepository(TrainProfileRepository) private trainProfileRepository : TrainProfileRepository,
    ) {}

    async createTrack(trainId : number, addBibleTrackDto : AddBibleTrackDto) :Promise<void> {
        await this.bibleTrackRepository.createTrack(trainId, addBibleTrackDto);
        const amount = await this.bibleTrackRepository.getTrackAmount(trainId);
        await this.trainRepository.updateTrackAmount(trainId, amount);
    }

    async deleteTrack(trainId:number, trackDate: string, userId:number) : Promise<any> {
        await this.bibleTrackRepository.delete({trainId,date:trackDate});
        await this.checkStampRepository.deleteCheckStampsForOneTrack(trainId, trackDate);
        // const trackCheckStampAmount = await this.checkStampRepository.getTrackCheckStampAmount(trainId, trackDate);
        const amount = await this.bibleTrackRepository.getTrackAmount(trainId);
        await this.trainRepository.updateTrackAmount(trainId, amount);
    }

    async completeTrack(trainId:number, trackDate: string, userId:number) : Promise<any> {// 비슷한 부분 함수로 처리하기
        await this.checkStampRepository.completeTrack(trainId,trackDate,userId);
        const trackCheckStampAmount = await this.checkStampRepository.getTrackCheckStampAmount(trainId, trackDate);
        await this.bibleTrackRepository.updateCompletedAmount(trainId, trackDate, trackCheckStampAmount);
        const myAllCheckStampAmount =  await this.checkStampRepository.getMyAllCheckStampAmount(trainId, userId);
        await this.trainProfileRepository.update({
            userId,
            trainId
        }, {
            completeCount:myAllCheckStampAmount
        });
    }

    async cancelStamp(trainId:number, trackDate: string, userId:number) : Promise<any> {// 비슷한 부분 함수로 처리하기
        await this.checkStampRepository.delete({trainId,trackDate,userId});
        const trackCheckStampAmount = await this.checkStampRepository.getTrackCheckStampAmount(trainId, trackDate);
        await this.bibleTrackRepository.updateCompletedAmount(trainId, trackDate, trackCheckStampAmount);
        const myAllCheckStampAmount =  await this.checkStampRepository.getMyAllCheckStampAmount(trainId, userId);
        await this.trainProfileRepository.update({
            userId,
            trainId
        }, {
            completeCount:myAllCheckStampAmount
        });
    }

    async showStampList(trainId:number, trackDate : string) {
        return this.checkStampRepository.getStampList(trainId, trackDate);
    }

    async getTrack(trainId :number, date:Date, userId:number) : Promise<any> {
        const track =  await this.bibleTrackRepository.findOneTrack(trainId, date, userId);
        console.log(track)
        const userStamp = track.checkStamps && track.checkStamps.length ? track.checkStamps.find(stamp => stamp.userId === userId) : null;
            const newObj = {
                ...track,
                status:null
            }
            newObj.status = userStamp&& userStamp.status ?  userStamp.status: "UNCOMPLETE";
            console.log(newObj);
            return newObj;
    }

    async getTrackList(trainId:number, userId:number, page:number, pageSize:number): Promise<any> {
        const list = await this.bibleTrackRepository.findAllTracks(trainId,userId, page, pageSize);
        // return list.map((track) => {
        //     track.status = 
        // })
        return list.map((track) => {
        
            const userStamp = track.checkStamps && track.checkStamps.length ? track.checkStamps.find(stamp => stamp.userId === userId) : null;
            const newObj = {
                ...track,
                status:userStamp && userStamp.status ?  userStamp.status: "UNCOMPLETE"
            }
            return newObj;
         })

    }

    async getTracks(trainId: number, startDate: Date, endDate : Date) {
        return await this.bibleTrackRepository.findTracks(trainId, startDate, endDate);
    }
}
