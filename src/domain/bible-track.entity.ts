import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { Bible } from "./bible.entity";

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

    @Column({
        type:'int',
        name : 'completed_amount',
        default : 0,
    })
    completeAmount : number;
}