import { HttpException, HttpStatus, NotFoundException } from "@nestjs/common";
import { BibleTrack } from "src/domain/bible-track.entity";
import {  AbstractRepository, EntityRepository, Repository } from "typeorm";
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

    private async checkExistTrack(trainId:number, date:Date) {
        const bibleTrack : BibleTrack = await this.findOneByPk(trainId, date);
        if(bibleTrack) {
            throw new HttpException('이미 같은 pk로 존재하는 트랙이 있습니다', HttpStatus.FOUND);
        }
    }

    async findOneByPk(trainId:number, date:Date) {
        const bibleTrack : BibleTrack = await this.findOne({trainId, date});
        return bibleTrack;
    }


    //메서드명을 예쁘게 바꾸기
    //query 메서드로 정리하기
    async findOneTrack(trainId:number, trackDate:Date, userId:number) {
        const track = await this.query(`
        SELECT 
        tot.*, 
        st_b.chapter as start_chapter_name,
        ed_b.chapter as end_chapter_name
         FROM (select track.train_id, track.date, track.start_chapter, track.end_chapter, track.start_page, track.end_page, stamp.status from 
        (select * from bible_track where train_id = ? AND date = ?) as track
        left join (select * from check_stamp where train_id = ? AND track_date = ? AND user_id = ?) as stamp on
        track.train_id = stamp.train_id AND track.date = stamp.track_date) as tot 
        left join bible as st_b on tot.start_chapter = st_b.id
        left join bible as ed_b on tot.end_chapter = ed_b.id;
        `, [trainId, trackDate,trainId, trackDate, userId])
        if(!track) {
            throw new NotFoundException("특정 bible-track을 찾을 수 없습니다");
        }
        return track;
    }

    //메서드명을 예쁘게 바꾸기
    //query 메서드로 정리하기
    async findAllTracks(trainId:number, userId:number, page : number, pageSize: number = 1) {
        const list = await this.query(`
        SELECT tot.*, st_b.chapter as start_chapter_name, ed_b.chapter as end_chapter_name FROM (select * from
            (select date, start_chapter, end_chapter, start_page, end_page, content from bible_track where train_id =?) as t 
            left join
            (select status, track_date from check_stamp where user_id = ? AND train_id = ?) as cs 
            on t.date = cs.track_date order by date desc LIMIT ${pageSize*(page-1)}, ${(pageSize*(page-1))+pageSize}) as tot LEFT JOIN bible as st_b ON tot.start_chapter = st_b.id LEFT JOIN bible as ed_b ON tot.end_chapter = ed_b.id;
        `, [trainId, userId, trainId]);
        return list;
    }

    async findTracks( trainId:number, startDate: Date, endDate:Date) {
        return await this.query(`
            SELECT tracks.*, stb.chapter as start_chapter_name, edb.chapter as end_chapter_name FROM 
            (select bible_track.* from bible_track where train_id = ? AND date >=? AND date <= ?) as tracks 
            left join bible as stb on stb.id = tracks.start_chapter left join bible as edb on edb.id = tracks.end_chapter`, 
            [trainId, startDate, endDate])
    }
}