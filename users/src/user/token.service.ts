import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserToken } from "./userToken";
import { Repository } from 'typeorm'

@Injectable()
export class TokenService {

    constructor(@InjectRepository(UserToken) private readonly tokenREpository: Repository<UserToken>) {

    }

    async save(options){
        return this.tokenREpository.save(options);
    }

    async findOne(options){
        return this.tokenREpository.findOne(options)
    }

    async delete(options) {
        Logger.log('deleting token', options)
        return this.tokenREpository.delete(options)
    }

}