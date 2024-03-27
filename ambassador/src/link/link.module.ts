import {Module, forwardRef} from '@nestjs/common';
import {LinkController} from './link.controller';
import {LinkService} from './link.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Link} from "./link";
import { UserModule } from 'src/user/user.module';
import { KafkaModule } from 'src/kafka/kafka.module';


@Module({
    imports: [
        TypeOrmModule.forFeature([Link]),
        forwardRef(()=>KafkaModule),
        forwardRef(()=>UserModule),
    ],
    controllers: [LinkController],
    providers: [LinkService],
    exports: [LinkService]
})
export class LinkModule {
}
