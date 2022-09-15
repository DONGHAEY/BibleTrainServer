import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryColumn } from "typeorm";
import { BibleTrack } from "./bible-track.entity";
import { TrainProfile } from "./train-profile.entity";

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

    @ManyToOne(type => BibleTrack, bibleTrack => bibleTrack.checkStamps, {
        onDelete: 'CASCADE',
    })
    @JoinColumn(
        [
            {name:'train_id', referencedColumnName:'trainId'}, 
            {name:'track_date', referencedColumnName:'date'}
        ]
    )
    track : BibleTrack

    @ManyToOne(type => TrainProfile, trainProfile => trainProfile.checkStamps, {
        onDelete: 'CASCADE',
    })
    @JoinColumn([
        {name : 'user_id', referencedColumnName:'userId'}, 
        {name:'train_id', referencedColumnName:'trainId'}
    ])
    trainProfile : TrainProfile;

    // @OneToOne(type=> BibleTrack, bibleTrack => bibleTrack.myCheckStamp)
    // @JoinColumn(
    //     [{
    //         name:'train_id',
    //         referencedColumnName:'trainId'
    //     },
    //     {
    //         name:'track_date',
    //         referencedColumnName:'date'
    //     },
    //     {
    //         name:'user_id',
    //         referencedColumnName:'user_id'
    //     }
    // ]
    // )
}