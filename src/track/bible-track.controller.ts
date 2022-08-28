import { Body, Controller, Delete, Get, Param, Post, Query, UseFilters, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { query } from 'express';
import { GetUser } from 'src/auth/decorator/userinfo.decorator';
import { AuthGuard } from 'src/auth/security/auth.guard';
import { TrainRoles } from 'src/train/decorator/train-role.decorator';
import { TrainRolesGuard } from 'src/train/guard/train-roles.guard';
import { RoleFormat } from 'src/domain/train-profile.entity';
import { User } from 'src/domain/user.entity';
import { BibleTrackService } from './bible-track.service';
import { AddBibleTrackDto } from './dto/AddBibleTrack.dto';

@Controller('/bible-track')
@UseGuards(AuthGuard, TrainRolesGuard)
export class BibleTrackController {
    constructor(
        private bibleTrackService : BibleTrackService
    ) {}


    //일반 사용자 UI용
    @Get('/:trainId')
    @TrainRoles(RoleFormat.CAPTAIN, RoleFormat.CREW, RoleFormat.VIEWER)
    async showGeneralTrackList(
        @GetUser() user: User, 
        @Param('trainId') trainId: number,
        @Query('page') page:number=1
    ) : Promise<any> {
        return await this.bibleTrackService.getTrackList(trainId, user.id, page, 6);
    }

    //captain의 보기용 // StartDate ~ EndDate 날짜로해서 받을 수 있도록 메서드로 정의한다.
    //getTrackList 메서드를 join 옵션을 추가하고, 날짜로 term을 만들 수 있도록 정의한다.
    @Get('/:trainId/showTrackList')
    @TrainRoles(RoleFormat.CAPTAIN)
    async showTrackListWithTerm(
        @Param('trainId') trainId: number, 
        @Query('startDate') startDate:Date,
        @Query('endDate') endDate : Date 
    ) : Promise<any> {
        return await this.bibleTrackService.getTracks(trainId, startDate, endDate);
    }

    @Post('/:trainId/addTrack')
    @TrainRoles(RoleFormat.CAPTAIN)
    @UsePipes(ValidationPipe)
    async addTrack(
        @Param('trainId') trainId: number, 
        @Body() addBibleTrackDto : AddBibleTrackDto
    ) : Promise<string> 
    {
        await this.bibleTrackService.createTrack(trainId, addBibleTrackDto);
        return 'okay'
    }

    @Get('/:trainId/:trackDate')
    @TrainRoles(RoleFormat.CAPTAIN, RoleFormat.CREW, RoleFormat.VIEWER)
    async showTrack(
        @GetUser() user : User, 
        @Param('trainId') trainId : number, 
        @Param('trackDate') trackDate : Date
    ) {
        return await this.bibleTrackService.getTrack(trainId, trackDate, user.id);
    }

    @Post('/:trainId/:trackDate/complete')
    @TrainRoles(RoleFormat.CAPTAIN, RoleFormat.CREW)
    async completeTrack(
        @GetUser() user : User,
        @Param('trainId') trainId: number,
        @Param('trackDate') trackDate:Date
    ) : Promise<void> 
    {
        await this.bibleTrackService.completeTrack(trainId, trackDate, user.id);
    }

    //특정 날에 train 내 사용자들의 스탬프 리스트를 불러온다.
    //날짜로해서 받을 수 있도록 메서드로 재 정의한다.
    @Get('/:trainId/:trackDate/showStampList')
    @TrainRoles(RoleFormat.CAPTAIN)
    async showStampList(
        @GetUser() user: User,
        @Param('trainId') trainId: number,
        @Param('trackDate') trackDate:Date
    ) : Promise<any>
    {
        return await this.bibleTrackService.showStampList(trainId, trackDate);
    }

    //특정 날에 train 내 사용자들의 스탬프 리스트를 불러온다.
    //날짜로해서 받을 수 있도록 메서드로 재 정의한다.
    @Delete('/:trainId/:trackDate/delete')
    @TrainRoles(RoleFormat.CAPTAIN)
    async deleteTrack(
        @GetUser() user: User,
        @Param('trainId') trainId: number,
        @Param('trackDate') trackDate:Date
    ) : Promise<any>
    {
        await this.bibleTrackService.deleteTrack(trainId, trackDate);
    }
}