import { Body, Controller, Get, Post, Req, Res, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import {Response} from 'express'
import { Request } from 'express'
import { UserDto } from './dto/user.dto';
import { AuthGuard } from './security/auth.guard';
import { RolesGuard } from './security/roles.guard';
import { Roles } from './decorator/role.decorator';
import { RoleType } from './role-type';

@Controller('auth')
export class AuthController {

    constructor(private authService : AuthService) {}
    
    @Post('/register')
    @UsePipes(ValidationPipe)
    async registerAccount(@Req() req:Request, @Body() userDto:UserDto) : Promise<any> {
        return await this.authService.registerUser(userDto);
    }
    
    @Post('/login')
    async login(@Body() userDto : UserDto, @Res() res : Response) : Promise<any> {
        const jwt = await this.authService.validateUser(userDto);
        console.log(jwt);
        res.setHeader('Authorization', 'Bearer ' + jwt.accessToken);
        return res.json(jwt);
    }
    
    @Get('/authenticate')
    @UseGuards(AuthGuard)
    isAuthenticated(@Req() req: Request): any { 
        const user: any = req.user;
        return user;
    }

    @Get('/admin-role')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(RoleType.ADMIN, RoleType.USER)
    adminRoleCheck(@Req() req : Request) : any {
        const user : any = req.user;
        return user;
    }
}