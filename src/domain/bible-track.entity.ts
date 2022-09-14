import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { Bible } from "./bible.entity";
import { CheckStamp } from "./check-stamp.entity";
import { Train } from "./train.entitiy";

@Entity('bible_track')
export class BibleTrack {

    @PrimaryColumn( {
        name:'train_id',
        type:'int'
    } )
    trainId:number;

    @PrimaryColumn( {
        type:"date"
    } )
    date: Date;

    @Column({
        name:'start_chapter',
        type:'int'
    })
    startChapter : number;

    @Column({
        name:'end_chapter',
        type:'int'
    })
    endChapter : number;

    @Column({
        name:'start_page',
        type:'int'
    })
    startPage : number;

    @Column({
        name:'end_page',
        type:'int'
    })
    endPage : number;

    @Column({
        type:'varchar'
    })
    content : string;

    @ManyToOne(type => Train, train => train.tracks)
    @JoinColumn({name:'train_id'})
    train : Train

    @OneToMany(type => CheckStamp, checkStamp => checkStamp.track)
    checkStamps : CheckStamp[]

    // @OneToOne(type => CheckStamp, checkStamp=> checkstamp)
    // myCheckStamp : CheckStamp
}