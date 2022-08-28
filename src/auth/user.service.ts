import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOneOptions } from "typeorm";
import { UserDto } from "./dto/user.dto";
import { UserRepository } from "./repository/user.repository";
import * as bcrypt from 'bcrypt';
import { User } from "src/domain/user.entity";
import { TrainService } from "src/train/train.service";

@Injectable()
export class UserService {

    constructor(
        private trainService : TrainService,
        @InjectRepository(UserRepository) private userRepository: UserRepository,
    ) {  }

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

    // async deleteUser(userId : number) {
    //     const {myProfiles} = await this.userRepository.findOne(userId, {relations : ['myProfiles']});
    //     myProfiles.forEach(async (myProfile) => {
    //         this.trainService.deleteTrainProfile(userId, myProfile.trainId);
    //     })
    //     await this.userRepository.delete({
    //         id:userId
    //     });
    // }
}