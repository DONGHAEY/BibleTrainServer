import { HttpException, HttpStatus, NotFoundException } from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import { BibleTrack } from "src/domain/bible-track.entity";
import { CheckStamp } from "src/domain/check-stamp.entity";
import {  AbstractRepository, Connection, EntityRepository, getRepository, Repository } from "typeorm";
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

    async getTrackAmount(trainId:number) {
        const dd = await this.query(`select count(*) as amount from bible_track where train_id=${trainId}`);
        return dd[0].amount
    }

    async updateCompletedAmount(trainId :number, trackDate:string, completedAmount: number) {
        await this.query(`update bible_track SET completed_amount=${completedAmount} where train_id=${trainId} AND date='${trackDate}'`);
    }

    private async checkExistTrack(trainId:number, date:Date) {
        const bibleTrack : BibleTrack = await this.findOneByPk(trainId, date);
        if(bibleTrack) {
            throw new HttpException('이미 같은 pk로 존재하는 트랙이 있습니다', HttpStatus.FOUND);
        }
    }

    async findOneByPk(trainId:number, date:Date) {
        const bibleTrack : BibleTrack = await this.findOne({trainId, date});
        console.log(bibleTrack);
        return bibleTrack;
    }

    async findOneTrack(trainId:number, trackDate:Date, userId:number) {
    //     const track = await this.query(`
    // select track.completed_amount as completedAmount, track.train_id as trainId, track.date, track.start_chapter as startChapter, track.content, track.end_chapter as endChapter, track.start_page as startPage, track.end_page as endPage, stamp.status from 
    //     (select * from bible_track where train_id = ? AND date = ?) as track
    //         left join (select * from check_stamp where train_id = ? AND track_date = ? AND user_id = ?) as stamp on
    //         track.train_id = stamp.train_id AND track.date = stamp.track_date;
    //     `, [trainId, trackDate,trainId, trackDate, userId])
    //     if(!track) {
    //         throw new NotFoundException("특정 bible-track을 찾을 수 없습니다");
    //     }
    //     return track[0];

    const bibleTrack = await this.findOne({
        where: {
            trainId,
            date : trackDate
        },
        relations:['checkStamps']
    });
    console.log(bibleTrack);
    return bibleTrack;

    }

    async findAllTracks(trainId:number, userId:number, page : number, pageSize: number = 1) {
        // const list = await this.createQueryBuilder("bible_track").select([
	    //     'date',
	    //     'start_chapter as startChapter',
	    //     'end_chapter as endChapter',
	    //     'start_page as startPage',
	    //     'end_page as endPage',
	    //     'content',
	    //     'completed_amount as completedAmount'
        // ]).leftJoin(
        //     (qb) =>
        //         qb
        //         .from(CheckStamp, 'check_stamp')
        //         .select(['status', 'track_date'])
        //         .where(`user_id = ${userId} AND train_id = ${trainId}`),
        //     'L',
        //     'bible_track.date = L.track_date'
        // )
        // .addSelect('L.status')
        // .where(`bible_track.train_id = ${trainId}`)
        // .orderBy('date', 'DESC')
        // .getRawMany();

        // return list;

        const bibleTracks = await this.find({
            where: {
                trainId
            },
            relations:['checkStamps'],
            order:{
                date:'DESC'
            }
        });
        console.log(bibleTracks);
        return bibleTracks;
    }


    // async findAllTracks(trainId:number, userId:number, page : number, pageSize: number = 1) {
    //     const list = await this.query(`
    //     select bt.date, bt.start_chapter, bt.end_chapter, bt.start_page, bt.end_page, cs.status, b1.chapter as st, b2.chapter as ed from 
    //     bible_track as bt
    //     left outer join (select * from check_stamp where user_id = ${userId} AND train_id = ${trainId}) as cs 
    //     ON bt.train_id = cs.train_id AND bt.date = cs.track_date
    //     left outer join bible as b1 on b1.id = bt.start_chapter
    //     left outer join bible as b2 on b2.id = bt.end_chapter
    //     order by bt.date desc
    //     LIMIT ${pageSize*(page-1)}, ${(pageSize*(page-1))+pageSize};
    //     `);
    //     return list;
    // }

    async findTracks( trainId:number, startDate: Date, endDate:Date) {
        return await this.query(`
        SELECT tracks.*, stb.chapter as start_chapter_name, edb.chapter as end_chapter_name FROM 
        (select bible_track.* from bible_track where train_id = ? AND date >=? AND date <= ?) as tracks 
        left join bible as stb on stb.id = tracks.start_chapter left join bible as edb on edb.id = tracks.end_chapter`, 
        [trainId, startDate, endDate])
    }
}