import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { GetUser } from 'src/auth/decorator/userinfo.decorator';
import { AuthGuard } from 'src/auth/security/auth.guard';
import { User } from 'src/user/entity/user.entity';
import { TrainService } from './train.service';
import { MakeTrainDto } from './dto/MakeTrain.dto';
import { TrainProfile, RoleFormat } from './entity/trainProfile.entity';
import { Train } from './entity/train.entity';
import { TrainRolesGuard } from './guard/train-roles.guard';
import { TrainRoles } from './decorator/train-role.decorator';
import { TrainMembersValidationPipe } from './pipes/train-member-validation.pipe';
import { JoinTrainDto } from './dto/JoinTrain.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { multerOptions } from 'src/common/utils';
import { trainMemberService } from './train-member.service';

@Controller('/train')
@UseGuards(AuthGuard, TrainRolesGuard)
export class TrainController {
  constructor(
    private trainService: TrainService,
    private trainMemberService: trainMemberService,
  ) {}

  /*/기차를 만들때 사용하는 메서드이다/*/
  @Post('/create')
  @UsePipes(ValidationPipe)
  async createTrain(
    @Body() trainDto: MakeTrainDto,
    @GetUser() user: User,
  ): Promise<string> {
    const trainInfo: Train = await this.trainService.createTrainAndJoin(
      `${trainDto.trainName}(${trainDto.churchName})`,
      user.id,
    );
    const joinTrainDto: JoinTrainDto = {
      nickName: trainDto.captainName,
      joinKey: trainInfo.joinKey,
    };
    await this.trainMemberService.joinTrain(
      user.id,
      trainInfo.id,
      joinTrainDto,
      RoleFormat.CAPTAIN,
    );
    return `하나님이 주신 열차 #${trainInfo.id}`;
  }

  /*/기차정보를 불러오는 메서드이다/*/
  @Get('/:trainId')
  async showTrainInfo(@Param('trainId') trainId: number): Promise<Train> {
    const train = await this.trainService.getTrain(trainId);
    return train;
  }

  @Get('/:trainId/getJoinKey')
  @TrainRoles(RoleFormat.CAPTAIN)
  async getJoinKey(@Param('trainId') trainId: number): Promise<string> {
    return await this.trainService.getTrainJoinKey(trainId);
  }

  /*/ 기차를 삭제하는 메서드이다 /*/
  @Delete('/:trainId')
  @TrainRoles(RoleFormat.CAPTAIN)
  async deleteTrain(@Param('trainId') trainId: number): Promise<void> {
    await this.trainService.deleteTrain(trainId);
  }

  /** 기차에 가입할 때 사용하는 메서드이다 */
  @Post('/:trainId/join')
  @UsePipes(ValidationPipe)
  async joinTrain(
    @GetUser() user: User,
    @Param('trainId') trainId: number,
    @Body() joinTrainDto: JoinTrainDto,
  ): Promise<string> {
    await this.trainMemberService.joinTrain(
      user.id,
      trainId,
      joinTrainDto,
      RoleFormat.CREW,
    );
    return '기차에 탑승되었습니다.';
  }

  /*/내가 속해있는 기차의 이웃 프로필들을 불러오는 메서드이다 /*/
  @Get('/:trainId/trainMemberProfiles')
  @TrainRoles(RoleFormat.CAPTAIN, RoleFormat.CREW)
  async trainMembersProfiles(
    @Param('trainId') trainId: number,
  ): Promise<TrainProfile[]> {
    return await this.trainMemberService.getTrainMembersProfiles(trainId);
  }

  /*/한명 유저의 모든 가입되어있는 기차 라이선스들을 불러와 반환한다/*/
  @Post('/trainProfiles')
  async myProfiles(@GetUser() user: User): Promise<TrainProfile[]> {
    return await this.trainMemberService.getTrainProfiles(user.id);
  }

  /*/내가 속해있는 기차의 기차프로필을 불러와 반환한다/*/
  @Get('/trainProfile/:trainId')
  async getMyProfile(
    @GetUser() user: User,
    @Param('trainId') trainId: number,
  ): Promise<TrainProfile> {
    return await this.trainMemberService.getTrainProfile(user.id, trainId);
  }

  /*/ 기차프로필의 역할을 변경한다, 단 이 기능은 기장만 사용 할 수 있다 /*/
  @Put('/:trainId/:userId/changeRole')
  @TrainRoles(RoleFormat.CAPTAIN)
  async changeRole(
    @Param('trainId') trainId: number,
    @Param('userId') userId: number,
    @Body('role', TrainMembersValidationPipe) role: RoleFormat,
  ): Promise<void> {
    await this.trainMemberService.changeProfileRole(userId, trainId, role);
  }

  /*/ 자신의 기차 프로필 이미지를 변경하기 위한 메서드이다 /*/
  @Post('/:trainId/changeMyProfileImg')
  @TrainRoles(RoleFormat.CAPTAIN, RoleFormat.CREW)
  @UseInterceptors(FilesInterceptor('img', 10, multerOptions('userProfiles')))
  uploadProfileImg(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Param('trainId') trainId: number,
    @GetUser() user: User,
  ) {
    return this.trainMemberService.uploadImg(user.id, trainId, files);
  }

  /*/ 내 기차에 속해있는 다른 한명의 프로필을 불러와 반환하는 메서드이다 /*/
  @Get('/:trainId/:userId')
  @TrainRoles(RoleFormat.CAPTAIN, RoleFormat.CREW)
  async getOtherTrainProfile(
    @Param('trainId') trainId: number,
    @Param('userId') userId: number,
  ) {
    return await this.trainMemberService.getTrainProfile(userId, trainId);
  }

  /*/ 자신의 기차 프로필을 지우며 기차를 탈퇴하는 메서드이다 /*/
  @Delete('/:trainId/exit')
  @TrainRoles(RoleFormat.CREW)
  async deleteMyTrainProfile(
    @GetUser() user: User,
    @Param('trainId') trainId: number,
  ): Promise<void> {
    await this.trainMemberService.deleteTrainProfile(user.id, trainId);
  }

  /*/ 기차에 있는 다른 기차 프로필을 삭제하는 메서드이다, 단 이 메서드는 기장만이 사용 할 수 있다 /*/
  @Delete('/:trainId/:userId')
  @TrainRoles(RoleFormat.CAPTAIN)
  async deleteOtherTrainProfile(
    @Param('trainId') trainId: number,
    @Param('userId') userId: number,
  ): Promise<void> {
    await this.trainMemberService.deleteTrainProfile(userId, trainId);
  }
}
