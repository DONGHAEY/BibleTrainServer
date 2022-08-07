import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserDto } from './dto/user.dto';
import { UserService } from './user.service';
import * as bcrypt from 'bcrypt';
import { Payload } from './security/payload.interface';
import { User } from './entity/user.entity';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService : JwtService,
    ) {}

    async registerUser(newUser : UserDto) : Promise<UserDto> {
        let userFind: UserDto = await this.userService.findByFields({where : {username : newUser.username }})
        if(userFind) {
            throw new HttpException('UserName Aleady Used!', HttpStatus.BAD_REQUEST)
        }
        return await this.userService.save(newUser);
    }

    async validateUser(userDto : UserDto) : Promise<{accessToken : string} | undefined> {

        let userFind : User = await this.userService.findByFields({
            where: {username : userDto.username}
        });

        const validatedPassword = await bcrypt.compare(userDto.password, userFind.password);

        if(!userFind || !validatedPassword) {
            throw new UnauthorizedException();
        }

        console.log(userFind);

        this.convertInAuthorities(userFind);

        console.log(userFind);

        const payload : Payload = {
            id : userFind.id,
            username: userFind.username,
            authorities: userFind.authorities
        };

        return {
            accessToken : this.jwtService.sign(payload),
        };
    }

    async tokenValidateUser(payload : Payload) : Promise<UserDto | undefined> {
        const userFind = await this.userService.findByFields({
            where : { id : payload.id }
        });
        this.flatAuthorities(userFind);
        return userFind;
    }

    private flatAuthorities(user: any): User {
        if (user && user.authorities) {
            const authorities: string[] = [];
            user.authorities.forEach(authority => authorities.push(authority.authorityName));
            user.authorities = authorities;
        }
        return user;
    }
    
    private convertInAuthorities(user: any): User {
        if (user && user.authorities) {
            const authorities: any[] = [];
            user.authorities.forEach(authority => authorities.push({ name: authority.authorityName }));
            user.authorities = authorities;
        }
        return user;
    }
}
