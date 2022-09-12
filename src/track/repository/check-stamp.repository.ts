import { HttpException, HttpStatus } from "@nestjs/common";
import { CheckStamp, STAMPSTAT } from "src/domain/check-stamp.entity";
import { EntityRepository, Repository } from "typeorm";

@EntityRepository(CheckStamp)
export class CheckStampRepository extends Repository<CheckStamp> { 

    async completeTrack(trainId:number, trackDate: string, userId:number) : Promise<any> {
        await this.checkExistTrack(trainId, trackDate, userId);
        await this.save({
            trackDate,
            userId,
            trainId,
            status : STAMPSTAT.COMPLETE
        })
    }

    async deleteCheckStampsForOneTrack(trainId : number, trackDate:string) : Promise<void> {
        await this.delete({
            trainId,
            trackDate
        });
    } //나중에 이 메서드가 필요없도록 ONDELETE속성을 만들어주자..

    async getTrackCheckStampAmount(trainId:number, trackDate: string) : Promise<number> {
        const dd = await this.query(`SELECT COUNT(*) as amount from check_stamp where train_id=${trainId} AND track_date='${trackDate}'`);
        return dd[0].amount;
    }

    async getMyAllCheckStampAmount(trainId:number, userId: number) : Promise<number> {
        const dd = await this.query(`SELECT COUNT(*) as amount from check_stamp where train_id=${trainId} AND user_id='${userId}'`);
        console.log( dd[0].amount)
        return dd[0].amount;
    }

    async getStampList(trainId : number, trackDate : string) {
        return this.query(`
            select profiles.*, status from (select user_id, nick_name, profile_image from train_profile where train_id = ?) as profiles left join (select * from check_stamp where track_date = ?) as stamp on stamp.user_id = profiles.user_id;
        `, [trainId, trackDate]);
    }

    private async checkExistTrack(trainId:number, trackDate: string, userId:number) {
        const checkStamp : CheckStamp = await this.findOneByPk(trainId, trackDate, userId);
        if(checkStamp) {
            throw new HttpException("이미 똑같은 pk값을 가진 스탬프가 존재합니다", HttpStatus.FOUND);
        }
        return checkStamp;
    }

    async findOneByPk(trainId:number, trackDate: string, userId:number) {
        return await this.findOne({trainId, trackDate, userId});
    }
}