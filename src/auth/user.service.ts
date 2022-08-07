import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOneOptions } from "typeorm";
import { UserDto } from "./dto/user.dto";
import { UserRepository } from "./repository/user.repository";
import * as bcrypt from 'bcrypt';
import { User } from "./entity/user.entity";

@Injectable()
export class UserService {

    constructor(@InjectRepository(UserRepository) private userRepository: UserRepository) {  }

    async findByFields(options : FindOneOptions) : Promise<User | undefined> {
        return await this.userRepository.findOne(options);
    }

    async save(userDto : UserDto) : Promise<UserDto | undefined> {
        await this.transformPassword(userDto);
        console.log(userDto);
        return await this.userRepository.save(userDto);
    }

    async transformPassword(user : UserDto) : Promise<void> {
        user.password = await bcrypt.hash(
            user.password, 
            10
        );
        return Promise.resolve();
    }
}