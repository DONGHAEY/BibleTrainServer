import { Column, Entity, JoinColumn, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { TrainProfile } from "./train-profile.entity";
import { UserAuthority } from "./user-authority.entity";

@Entity('user')
export class User {
    @PrimaryGeneratedColumn()
    id:number;
    
    @Column()
    username:string;

    @Column()
    password:string;

    @OneToMany(type=>UserAuthority, userAuthority => userAuthority.user, {eager:true})
    authorities? : any[];

    @OneToMany(type => TrainProfile, trainProfile => trainProfile.user, {
        cascade:true
    })
    myProfiles? : any[];
}