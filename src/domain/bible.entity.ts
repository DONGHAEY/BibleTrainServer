import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('bible')
export class Bible {
    @PrimaryGeneratedColumn()
    id : number;
    @Column({
        type:'varchar'
    })
    chapter : string;

    @Column({
        type:"varchar"
    })
    sign : string;
    @Column({
        type:'int'
    })
    page: number
}