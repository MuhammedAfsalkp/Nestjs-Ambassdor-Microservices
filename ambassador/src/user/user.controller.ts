import { ClassSerializerInterceptor, Controller, Get, Res, UseGuards, UseInterceptors, Logger } from '@nestjs/common';
import { Response } from "express";
import { RedisService } from 'src/shared/redis.service';

@Controller()
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {

    constructor(
        private readonly redisService: RedisService) {
    }


    @Get('rankings')
    async rankings(
        @Res() response: Response
    ) {
        const client = this.redisService.getClient();

        client.zrevrangebyscore('rankings', '+inf', '-inf', 'withscores', (err, result) => {
            let score;

            response.send(result.reduce((o, r) => {
                if (isNaN(parseInt(r))) {
                    return {
                        ...o,
                        [r]: score
                    }
                } else {
                    score = parseInt(r);
                    return o;
                }
            }, {}));
        });
    }
}
