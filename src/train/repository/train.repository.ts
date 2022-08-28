import { HttpException, HttpStatus, NotFoundException } from "@nestjs/common";
import { TrainProfile } from "src/domain/train-profile.entity";
import { Train } from "src/domain/train.entitiy";
import {  EntityRepository, Repository} from "typeorm";

@EntityRepository(Train)
export class TrainRepository extends Repository<Train> {
    async createTrain(trainName : string, userId : number) : Promise<Train> {
        const isSameName = await this.findOne( { where : { trainName : trainName } } );
        if(isSameName) {
            throw new HttpException('똑같은 열차 이름이 존재합니다.', HttpStatus.BAD_REQUEST)
        }
        const joinKey = await this.KeyAlgorithm();
        while(true) {
            const isSameKey = await this.findOneByJoinKey(joinKey);
            if(!isSameKey) {
                break;
            }
        }
        const train = await this.save({
            joinKey,
            trainName,
            captain:userId
        })
        return train;
    }

    async checkJoinKey(trainId:number, joinKey:string) : Promise<boolean> {
        const trainInfo : Train = await this.getTrainById(trainId);
        if(trainInfo.joinKey !== joinKey) {
            return false;
        }
        return true;
    }

    async getTrainById( trainId : number ) : Promise<Train> {
        const trainInfo : Train = await this.findOne(trainId);
        delete trainInfo.joinKey;
        if (!trainInfo) {
            throw new NotFoundException(`#${trainId}번 기차는 존재하지 않습니다`);
        }
        return trainInfo;
    }


    private async findOneByJoinKey(joinKey : string) : Promise<Train> {
        const trainInfo : Train = await this.findOne({
            joinKey
        })
        return trainInfo;
    }

    private async KeyAlgorithm() : Promise<string> {
        let key = ""
        let alp = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','S','Y','Z'];
        for(let i=0; i<4; i++) {
            const rand_0_26 = Math.floor(Math.random() * 26);
            key += alp[rand_0_26];
        };
        return key;
    }

}