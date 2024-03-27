import {
    Body,
    ClassSerializerInterceptor,
    Controller,
    Get,
    Logger,
    Param,
    Post,
    Req,
    UseGuards,
    UseInterceptors
} from '@nestjs/common';
import {LinkService} from "./link.service";
import { UserService } from 'src/user/user.service';

const logger = new Logger(`LinkController`)


@Controller('links')
@UseInterceptors(ClassSerializerInterceptor)
export class LinkController {
    constructor(
        private linkService: LinkService,
        private userService: UserService,
    ) {
    }

    @Get(':code')
    async link(@Param('code') code: string) {
        logger.log(`request to find link:${code}`)
        const link = await this.linkService.findOne({where: {
            code
        }, relations: ['products']})
        logger.log(`recieved link: ${link}`)
        link['user'] = await this.userService.get(`users/${link.user_id}`);
        return link;
    }

    @Post()
    async create(@Body() link: any) {
        logger.log(`request to create link: ${link}`);
        await this.linkService.save(link)
        
    }
}
