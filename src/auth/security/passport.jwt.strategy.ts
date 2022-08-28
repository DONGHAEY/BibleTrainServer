import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy, VerifiedCallback } from "passport-jwt";
import { AuthService } from "../auth.service";
import { Payload } from "./payload.interface";
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){

    constructor(private authService: AuthService){
        super({
            // jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            jwtFromRequest : ExtractJwt.fromExtractors([(request : Request) => request.cookies.jwt]),
            ignoreExpiration: true,
            secretOrKey: 'SECRET_KEY'
        })
    }

    async validate(payload: Payload, done: VerifiedCallback): Promise<any> {
        const user = await this.authService.tokenValidateUser(payload);
        if(!user) {
            return done(new UnauthorizedException({message: 'user does not exist'}), false);
        }
        return done(null, user);
    }
}


// npm install --save @nestjs/passport passport passport-local
// $ npm install --save-dev @types/passport-local