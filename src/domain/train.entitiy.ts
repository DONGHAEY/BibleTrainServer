import { userInfo } from "os";
import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { BibleTrack } from "./bible-track.entity";
import { TrainProfile } from "./train-profile.entity";
import { User } from "./user.entity";

// export enum TrainType {
//     PRAY = 'PRAY',
//     BIBLE = 'BIBLE'
// }


@Entity('train')
export class Train {
    @PrimaryGeneratedColumn()
    id : number

    @Column('varchar', { 
        name : 'train_name',
        unique:true,
        nullable:false
    })
    trainName : string

    @Column('int', { name : 'member_count', default:0, nullable:true})
    memberCount : number;

    @OneToMany(type => TrainProfile, trainProfile => trainProfile.trainId)
    members? : any[];

    @OneToMany(type => BibleTrack, bibleTrack => bibleTrack.train)
    
    tracks : BibleTrack[]

    @Column('varchar', {
        name:'join_key', 
        default:'',
        // nullable:false,
    })
    joinKey : string;

    @Column()
    captain:number;

    @Column({
        type: 'int',
        name : 'track_amount',
        default: 0,
    })
    trackAmount : number;
}
