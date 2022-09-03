import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { Bible } from "./bible.entity";

@Entity('bible_track')
export class BibleTrack {
    @PrimaryColumn({
        name:'train_id',
        type:'int'
    })
    trainId:number;

    @PrimaryColumn({
        type:"date"
    })
    date: Date;

    @Column({
        name:'start_chapter',
        type:'int'
    })
    startChapter : number;

    @ManyToOne(type => Bible, bible => bible.chapter)
    @JoinColumn({name : 'start_chapter'})
    startChapterInfo : Bible

    @Column({
        name:'end_chapter',
        type:'int'
    })
    endChapter : number;

    @ManyToOne(type => Bible, bible => bible.chapter)
    @JoinColumn({name : 'end_chapter'})
    endChapterInfo : Bible

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
        name : 'complete_amount',
        default : 0,
    })
    completeAmount : number;
}