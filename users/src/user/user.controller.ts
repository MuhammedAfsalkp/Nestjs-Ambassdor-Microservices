import { Controller, Get, Logger, Param } from "@nestjs/common";
import { UserService } from "./usere.service";

const ControllerLogger =  new Logger('UserController')
@Controller('users')
export class UserController{
    constructor(private userService: UserService){

    }

    @Get()
    async findAll(){
        return this.userService.find()
    }

    @Get(':id')
    async findOne(@Param('id')id: number){
        ControllerLogger.log('request to find user with id', id)
        return this.userService.findOne({where: {id}})
    }


}