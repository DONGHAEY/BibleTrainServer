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
    ) {  }

    /*/ 특정 기차의 트랙들을 반환한다 /*/
    @Get('/:trainId')
    @TrainRoles(RoleFormat.CAPTAIN, RoleFormat.CREW, RoleFormat.VIEWER)
    async showGeneralTrackList(
        @GetUser() user: User, 
        @Param('trainId') trainId: number,
        @Query('page') page:number=1
    ) : Promise<any> {
        return await this.bibleTrackService.getTrackList(trainId, user.id, page, 6);
    }

    /*/ 특정 기차의 트랙을 추가한다 /*/
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

    /*/ 특정 트랙 정보를 반환한다 /*/
    @Get('/:trainId/:trackDate')
    @TrainRoles(RoleFormat.CAPTAIN, RoleFormat.CREW, RoleFormat.VIEWER)
    async showTrack(
        @GetUser() user : User, 
        @Param('trainId') trainId : number,
        @Param('trackDate') trackDate : Date
    ) {
        return await this.bibleTrackService.getTrackInfo(trainId, trackDate, user.id);
    }

    /*/ 특정 트랙의 참여를 취소한다 /*/
    @Post('/:trainId/:trackDate/cancelStamp')
    @TrainRoles(RoleFormat.CAPTAIN, RoleFormat.CREW)
    async cancelStamp(
        @GetUser() user : User,
        @Param('trainId') trainId: number,
        @Param('trackDate') trackDate:string,
    ) : Promise<void> 
    {
        await this.bibleTrackService.cancelStamp(trainId, trackDate, user.id);
    }

    /*/ 특정 트랙의 참여를 완료한다 /*/
    @Post('/:trainId/:trackDate/complete')
    @TrainRoles(RoleFormat.CAPTAIN, RoleFormat.CREW)
    async completeTrack(
        @GetUser() user : User,
        @Param('trainId') trainId: number,
        @Param('trackDate') trackDate:string,
    ) : Promise<void>
    {
        await this.bibleTrackService.completeTrack(trainId, trackDate, user.id);
    }

    /*/ 특정트랙을 삭제한다 /*/
    @Post('/:trainId/:trackDate/deleteTrack')
    @TrainRoles(RoleFormat.CAPTAIN)
    async deleteTrack(
        @GetUser() user : User,
        @Param('trainId') trainId: number,
        @Param('trackDate') trackDate:string,
    ) : Promise<void> 
    {
        await this.bibleTrackService.deleteTrack(trainId, trackDate, user.id);
    }


    @Post("/:trainId/analysis")
    @TrainRoles(RoleFormat.CAPTAIN, RoleFormat.CREW)
    async trainAnalysis(
        @GetUser() user : User,
        @Param('trainId') trainId : number,
        @Query('startDate') startDate : Date = new Date(),
        @Query('endDate') endDate : Date = new Date()
    ) {
        return this.bibleTrackService.getTrackListWidthPeriod(trainId, startDate, endDate);
    }
}