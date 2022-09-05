import { ROUTES } from "@nestjs/core/router/router-module";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { Train } from "./train.entitiy";
import { User } from "./user.entity";



export enum RoleFormat {
    CAPTAIN = 'ROLE_CAPTAIN',
    CREW = 'ROLE_CREW',
    VIEWER = 'ROLE_VIEWER'
}


@Entity('train_profile')
export class TrainProfile {

    @PrimaryColumn({
        name: 'user_id'
    })
    userId : number


    @PrimaryColumn({
        name: 'train_id'
    })
    trainId : number

    @ManyToOne(type => Train, train => train.members)
    @JoinColumn({name : 'train_id'})
    train : Train


    @Column({
        name : 'nick_name'
    })
    nickName : string

    @Column({
        type:'enum',
        enum:RoleFormat,
    })
    role : RoleFormat

    @ManyToOne(type => User, user => user.myProfiles)
    @JoinColumn({name : 'user_id'})
    user : User

    @Column({
        name:'profile_image',
        type:"varchar",
        default : "https://url.kr/5usx7g"
    })
    profileImage : string

}