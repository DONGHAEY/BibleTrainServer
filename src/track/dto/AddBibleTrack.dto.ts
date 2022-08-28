import { IsNotEmpty } from 'class-validator'

export class AddBibleTrackDto {
    @IsNotEmpty()
    date : Date;
    @IsNotEmpty()
    startChapter : number;
    @IsNotEmpty()
    endChapter : number;
    @IsNotEmpty()
    startPage : number;
    @IsNotEmpty()
    endPage : number;
    @IsNotEmpty()
    content : string;
}