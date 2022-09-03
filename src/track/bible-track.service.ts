import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { STAMPSTAT } from 'src/domain/check-stamp.entity';
import { AddBibleTrackDto } from './dto/AddBibleTrack.dto';
import { CheckStampRepository } from './repository/check-stamp.repository';
import { BibleTrackRepository } from './repository/bible-track.repository';
import { TrainRepository } from 'src/train/repository/train.repository';

@Injectable()
export class BibleTrackService {
    constructor(
        @InjectRepository(TrainRepository) private trainRepository : TrainRepository,
        @InjectRepository(BibleTrackRepository) private bibleTrackRepository : BibleTrackRepository,
        @InjectRepository(CheckStampRepository) private checkStampRepository : CheckStampRepository,
    ) {}

    async createTrack(trainId : number, addBibleTrackDto : AddBibleTrackDto) :Promise<void> {
        await this.bibleTrackRepository.createTrack(trainId, addBibleTrackDto);
        const amount = await this.bibleTrackRepository.getTrackAmount(trainId);
        await this.trainRepository.updateTrackAmount(trainId, amount);
    }

    async completeTrack(trainId:number, trackDate: string, userId:number) : Promise<any> {
        await this.checkStampRepository.completeTrack(trainId,trackDate,userId);
        const track_amount = await this.checkStampRepository.getCheckStampAmount(trainId, trackDate);
        await this.bibleTrackRepository.updateCompletedAmount(trainId, trackDate, track_amount);
    }

    async cancelStamp(trainId:number, trackDate: string, userId:number) : Promise<any> {
        await this.checkStampRepository.delete({trainId,trackDate,userId});
        const track_amount = await this.checkStampRepository.getCheckStampAmount(trainId, trackDate);
        await this.bibleTrackRepository.updateCompletedAmount(trainId, trackDate, track_amount);
    }

    async showStampList(trainId:number, trackDate : Date) {
        return await this.checkStampRepository.getStampList(trainId, trackDate);
    }

    async getTrack(trainId :number, date:Date, userId:number) : Promise<any> {
        return await this.bibleTrackRepository.findOneTrack(trainId, date, userId);
    }

    async getTrackList(trainId:number, userId:number, page:number, pageSize:number): Promise<any> {
        return await this.bibleTrackRepository.findAllTracks(trainId,userId, page, pageSize);
    }

    async getTracks(trainId: number, startDate: Date, endDate : Date) {
        return await this.bibleTrackRepository.findTracks(trainId, startDate, endDate);
    }

    async testMet(userId:number, trainId:number) {
        await this.bibleTrackRepository.testMet(userId, trainId);
    }
}
