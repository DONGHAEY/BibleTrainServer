import { Body, Controller, Delete, Get, HttpCode, HttpException, HttpStatus, Param, Patch, Post, Put, Query, Req, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { GetUser } from 'src/auth/decorator/userinfo.decorator';
import { AuthGuard } from 'src/auth/security/auth.guard';
import { User } from 'src/domain/user.entity';
import { TrainService } from './train.service';
import { MakeTrainDto } from './dto/MakeTrain.dto';
import { RoleFormat, TrainProfile } from 'src/domain/train-profile.entity';
import { Train } from 'src/domain/train.entitiy';
import { TrainRolesGuard } from './guard/train-roles.guard';
import { TrainRoles } from './decorator/train-role.decorator';
import { TrainMembersValidationPipe } from './pipes/train-member-validation.pipe';
import { JoinTrainDto } from './dto/JoinTrain.dto';

@Controller('/train')
@UseGuards(AuthGuard, TrainRolesGuard)
export class TrainController {    
    constructor(
        private trainService : TrainService
    ) {}

    @Post('/create')
    @UsePipes(ValidationPipe)
    async createTrain(
        @Body() trainDto : MakeTrainDto, 
        @GetUser() user : User 
    ) : Promise<string>
    {
        const trainInfo : Train = await this.trainService.createTrain(`${trainDto.trainName}(${trainDto.churchName})`, user.id, trainDto);
        return `하나님이 우리에게 주신 성경 or 기도 열차 #${trainInfo.id}`
    }

    @Get('/:trainId')
    async showTrainInfo(
        @Param('trainId') trainId : number
    ) : Promise<Train>
    {
        return await this.trainService.getTrain(trainId); //이 메서드에서 리턴 받은 값에서.. joinKey는 포함시키지 않는다.
    }

    @Post('/:trainId/join')
    @UsePipes(ValidationPipe)
    async joinTrain(
        @GetUser() user:User, 
        @Param('trainId') trainId: number, 
        @Body() joinTrainDto : JoinTrainDto
    ) : Promise<string> 
    {
        await this.trainService.joinTrain(user.id, trainId, joinTrainDto, RoleFormat.CREW);
        return '기차에 탑승되었습니다.'
    }

    @Post('/trainProfiles')
    async myProfiles(
        @GetUser() user : User
    ) : Promise<TrainProfile[]>
    {
        return await this.trainService.getTrainProfiles(user.id);
    }

    @Get('/trainProfile/:trainId')
    async myProfile(
        @GetUser() user : User,
        @Param('trainId') trainId : number
    ) : Promise<TrainProfile>
    {
        return await this.trainService.getTrainProfile(user.id, trainId);
    }

    @Put('/:trainId/changeRole')
    @TrainRoles(RoleFormat.CAPTAIN)
    async changeRole(
        @Param('trainId') trainId : number, 
        @Body('role', TrainMembersValidationPipe) role : RoleFormat, 
        @Body('userId') userId : number
    ) : Promise<string>
    {
        await this.trainService.changeProfileRole(userId, trainId, role);
        return 'success';
    }

    @Delete('/:trainId')
    @TrainRoles(RoleFormat.CREW, RoleFormat.VIEWER)
    async deleteProfile(@GetUser() user : User, @Param('trainId') trainId : number) : Promise<string> 
    {
        await this.trainService.deleteTrainProfile(user.id, trainId);
        return 'success';
    }
}