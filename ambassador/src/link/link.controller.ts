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
import {AuthGuard} from "../user/auth.guard";
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/user.decorator';
import { Link } from './link';
import { KafkaService } from 'src/kafka/kafka.service';

const logger =  new Logger(`LInkController`)

@UseGuards(AuthGuard)
@Controller()
@UseInterceptors(ClassSerializerInterceptor)
export class LinkController {
    constructor(
        private linkService: LinkService,
        private kafkaService: KafkaService,
    ) {
    }

    @Post('links')
    async create(
        @Body('products') products: number[],
        @User() user,
    ) {
        const link = await this.linkService.save({
            code: Math.random().toString(36).substr(6),
            user_id: user['id'],
            products: products.map(id => ({id}))
        });

        await this.kafkaService.emit(['admin_topic', 'checkout_topic'],'linkCreated', link);
        return link;
    }


    @Get('stats')
    async stats(@User() user) {
        logger.log(`request to get stats by user:${JSON.stringify(user)}`)
        const links: Link[] = await this.linkService.find({
            user_id: user['id'],
            relations: ['orders']
        });
        logger.log(`links of the user: ${JSON.stringify(links,null, 2)}`)
        return links.map(link => {
            return {
                code: link.code,
                count: link.orders.length,
                revenue: link.orders.reduce((s, o) => s + o.total, 0)
            }
        })
    }
}
