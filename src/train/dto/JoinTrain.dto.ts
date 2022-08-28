import {IsNotEmpty} from 'class-validator'

export class JoinTrainDto {
    @IsNotEmpty()
    joinKey:string;
    @IsNotEmpty()
    nickName : string;
}