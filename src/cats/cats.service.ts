import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getConnection, Repository } from 'typeorm';
import { Cat } from './entity/cats.entity';

@Injectable()
export class CatsService {
    constructor(
        @InjectRepository(Cat)
        private catRepository : Repository<Cat>,
    ){}
    findAll() : Promise<Cat[]> {
        return this.catRepository.find();
    }
    findOne(id : number) : Promise<Cat> {
        return this.catRepository.findOne({
            where: {
                id,
            }
        });
    }
    async create(cat: Cat) : Promise<void> {
        await this.catRepository.save(cat);
    }
    async remove(id: number) : Promise<void> {
        await this.catRepository.delete(id);
    }
    async update(id: number, cat:Cat) : Promise<void> {
        const existedCat = await this.findOne(id);
        if(existedCat) {
            await getConnection().createQueryBuilder().update(Cat).set({
                name : cat.name,
                age : cat.age,
                breed : cat.breed
            }).where("id = :id", {id})
            .execute();
        }
    }
}
