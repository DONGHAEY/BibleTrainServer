import { HttpException, HttpStatus, NotFoundException } from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import { BibleTrack } from "src/domain/bible-track.entity";
import { CheckStamp } from "src/domain/check-stamp.entity";
import {  AbstractRepository, Between, Connection, EntityRepository, getRepository, Repository } from "typeorm";
import { AddBibleTrackDto } from "../dto/AddBibleTrack.dto";

@EntityRepository(BibleTrack)
export class BibleTrackRepository extends Repository<BibleTrack> {

    async createTrack(trainId : number, addBibleTrackDto : AddBibleTrackDto) :Promise<void> {
        await this.checkExistTrack(trainId, addBibleTrackDto.date);
        await this.save({
            trainId,
            ...addBibleTrackDto
        });
    }
    async findOneTrack(trainId:number, trackDate:Date, userId:number) {

    return await this.findOne({
        where: {
            trainId,
            date : trackDate
        },
        relations:['checkStamps']
    });
    }

    async findAllTracks(trainId:number, page : number, pageSize: number = 1) {
        const bibleTracks = await this.find({
            where: {
                trainId
            },
            relations:['checkStamps'],
            order:{
                date:'DESC'
            }
        });
        return bibleTracks;
    }

    async findPeriodTracks(trainId : number, startDate : Date, endDate: Date) {
        const list = await this.find({
            where: {
                trainId,
                date : Between(
                    startDate,
                    endDate
                )
            },
            relations:['checkStamps'],
            order:{
                date:'ASC'
            }
        });
        console.log(list);
        return list;
    }

    async getTrackAmount(trainId : number) {
        return await this.createQueryBuilder('bible-track').where(`train_id=${trainId}`).getCount();
    }

    private async checkExistTrack(trainId:number, date:Date) {
        const bibleTrack : BibleTrack = await this.findOne({trainId, date});
        if(bibleTrack) {
            throw new HttpException('이미 같은 pk로 존재하는 트랙이 있습니다', HttpStatus.FOUND);
        }
    }
}