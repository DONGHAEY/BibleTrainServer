import { IsNotEmpty } from 'class-validator'

export class MakeTrainDto {
    @IsNotEmpty()
    trainName : string
    @IsNotEmpty()
    churchName : string
    @IsNotEmpty()
    captainName : string
}