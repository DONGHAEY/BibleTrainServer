import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { GetUser } from 'src/auth/decorator/userinfo.decorator';
import { AuthGuard } from 'src/auth/security/auth.guard';
import { TrainRoles } from 'src/train/decorator/train-role.decorator';
import { TrainRolesGuard } from 'src/train/guard/train-roles.guard';
import { RoleFormat } from 'src/train/entity/trainProfile.entity';
import { User } from 'src/user/entity/user.entity';
import { BibleTrackService } from './bibleTrack.service';
import { AddBibleTrackDto } from './dto/AddBibleTrack.dto';

@Controller('/bible-track')
@UseGuards(AuthGuard, TrainRolesGuard)
export class BibleTrackController {
  constructor(private bibleTrackService: BibleTrackService) {}

  /*/ 특정 기차의 트랙들을 반환한다 /*/
  @Get('/:trainId/:startDate/:endDate')
  @TrainRoles(RoleFormat.CAPTAIN, RoleFormat.CREW, RoleFormat.VIEWER)
  async showGeneralMyTrackList(
    @GetUser() user: User,
    @Param('trainId') trainId: number,
    @Param('startDate') startDate: string,
    @Param('endDate') endDate: string,
  ): Promise<any> {
    return await this.bibleTrackService.getTrackList(
      trainId,
      user.id,
      startDate,
      endDate,
    );
  }

  /* 각자 프로필마다 다르게 표시되는 트랙 완료및 미완료 정보들을 불러올 수 있도록 */
  @Post('/:trainId/profileOtherTrackList/:startDate/:endDate')
  @TrainRoles(RoleFormat.CAPTAIN, RoleFormat.CREW, RoleFormat.VIEWER)
  async showProfileOtherTrackList(
    @Param('trainId') trainId: number,
    @Body('userId') userId: number,
    @Param('startDate') startDate: string,
    @Param('endDate') endDate: string,
  ): Promise<any> {
    return await this.bibleTrackService.getTrackList(
      trainId,
      userId,
      startDate,
      endDate,
    );
  }

  /*/ 특정 기차의 트랙을 추가한다 /*/
  @Post('/:trainId/addTrack')
  @TrainRoles(RoleFormat.CAPTAIN)
  @UsePipes(ValidationPipe)
  async addTrack(
    @Param('trainId') trainId: number,
    @Body() addBibleTrackDto: AddBibleTrackDto,
  ): Promise<void> {
    await this.bibleTrackService.createTrack(trainId, addBibleTrackDto);
  }

  /*/ 특정 트랙 정보를 반환한다 /*/
  @Get('/:trainId/:trackDate')
  @TrainRoles(RoleFormat.CAPTAIN, RoleFormat.CREW, RoleFormat.VIEWER)
  async showTrack(
    @GetUser() user: User,
    @Param('trainId') trainId: number,
    @Param('trackDate') trackDate: Date,
  ) {
    return await this.bibleTrackService.getTrackInfo(
      trainId,
      trackDate,
      user.id,
    );
  }

  /*/ 특정 트랙의 참여를 취소한다 /*/
  @Post('/:trainId/:trackDate/cancelStamp')
  @TrainRoles(RoleFormat.CAPTAIN, RoleFormat.CREW)
  async cancelStamp(
    @GetUser() user: User,
    @Param('trainId') trainId: number,
    @Param('trackDate') trackDate: Date,
  ): Promise<void> {
    await this.bibleTrackService.cancelStamp(trainId, trackDate, user.id);
  }

  /*/ 특정 트랙의 참여를 완료한다 /*/
  @Post('/:trainId/:trackDate/complete')
  @TrainRoles(RoleFormat.CAPTAIN, RoleFormat.CREW)
  async completeTrack(
    @GetUser() user: User,
    @Param('trainId') trainId: number,
    @Param('trackDate') trackDate: Date,
  ): Promise<void> {
    await this.bibleTrackService.completeTrack(trainId, trackDate, user.id);
  }

  /*/ 특정트랙을 삭제한다 /*/
  @Post('/:trainId/:trackDate/deleteTrack')
  @TrainRoles(RoleFormat.CAPTAIN)
  async deleteTrack(
    @GetUser() user: User,
    @Param('trainId') trainId: number,
    @Param('trackDate') trackDate: Date,
  ): Promise<void> {
    await this.bibleTrackService.deleteTrack(trainId, trackDate);
  }
}
