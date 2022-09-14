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
    ) {  }

    /*/ 특정 기차의 트랙을 만들기 위한 메서드 /*/
    async createTrack(trainId : number, addBibleTrackDto : AddBibleTrackDto) :Promise<void> {
        await this.bibleTrackRepository.createTrack(trainId, addBibleTrackDto);
        const amount = await this.bibleTrackRepository.getTrackAmount(trainId);
        await this.trainRepository.updateTrackAmount(trainId, amount);
    }

    /*/ 특정 기차의 특정 트랙을 삭제하기 위한 메서드 /*/
    async deleteTrack(trainId:number, trackDate: string, userId:number) : Promise<any> {
        await this.bibleTrackRepository.delete({trainId,date:trackDate});
        await this.checkStampRepository.deleteCheckStampsForOneTrack(trainId, trackDate);
        // const trackCheckStampAmount = await this.checkStampRepository.getTrackCheckStampAmount(trainId, trackDate);
        const amount = await this.bibleTrackRepository.getTrackAmount(trainId);
        await this.trainRepository.updateTrackAmount(trainId, amount);
    }

    /*/ 트랙에 도착했다고 확인하여 스탬프로 저장하는 메서드 /*/
    async completeTrack(trainId:number, trackDate: string, userId:number) : Promise<any> {// 비슷한 부분 함수로 처리하기
        await this.checkStampRepository.completeTrack(trainId,trackDate,userId);
    }

    /*/ 트랙을 달렸음을 취소하여 스탬프를 삭제하는 메서드 /*/
    async cancelStamp(trainId:number, trackDate: string, userId:number) : Promise<any> {// 비슷한 부분 함수로 처리하기
        await this.checkStampRepository.delete({trainId,trackDate,userId});
    }

    /*/ 특정 트랙의 참여현황을 반환하는 메서드 /*/
    async showTrackStampList(trainId:number, trackDate : string) {
        return this.checkStampRepository.getStampList(trainId, trackDate);
    }

    /*/ 특정 트랙의 정보를 반환하는 메서드 /*/
    async getTrackInfo(trainId :number, date:Date, userId:number) : Promise<any> {
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

    /*/ 특정 기차의 모든 트랙들을 반환하는 메서드 /*/ 
    //페이지네이션 기능 추가예정
    async getTrackList(trainId:number, userId:number, page:number, pageSize:number): Promise<any> {
        const list = await this.bibleTrackRepository.findAllTracks(trainId,userId, page, pageSize);
        return list.map((track) => {
            const userStamp = track.checkStamps && track.checkStamps.length ? track.checkStamps.find(stamp => stamp.userId === userId) : null;
            const newObj = {
                ...track,
                status:userStamp && userStamp.status ?  userStamp.status: "UNCOMPLETE"
            }
            return newObj;
         })
    }
}