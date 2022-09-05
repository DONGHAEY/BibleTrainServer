import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryColumn } from "typeorm";
import { BibleTrack } from "./bible-track.entity";

export enum STAMPSTAT {
    COMPLETE = "COMPLETE",
    TRYING = "TRYING"
}

@Entity('check_stamp')
export class CheckStamp {

    @PrimaryColumn({
        name:'user_id',
        type:'int'
    })
    userId : number;
    @PrimaryColumn({
        name:'train_id',
        type:'int',
    })
    trainId : number;
    @PrimaryColumn({
        name:'track_date',
        type: 'date'
    })
    trackDate : Date;

    @Column({
        type:"enum",
        enum: STAMPSTAT
    })
    status : STAMPSTAT
    
}