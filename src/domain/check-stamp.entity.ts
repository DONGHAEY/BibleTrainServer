import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryColumn } from "typeorm";
import { BibleTrack } from "./bible-track.entity";

export enum STAMPSTAT {
    COMPLETE = "COMPLETE",
    TRYING = "TRYING"
}

@Entity('check_stamp')
export class CheckStamp {

    @PrimaryColumn({
        name:'user_id'
    })
    userId : number;
    @PrimaryColumn({
        name:'train_id'
    })
    trainId : number;
    @PrimaryColumn({
        name:'track_date'
    })
    trackDate : Date;

    @Column({
        type:"enum",
        enum: STAMPSTAT
    })
    status : STAMPSTAT
}