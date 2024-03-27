import { Module, forwardRef } from '@nestjs/common';
import { OrderService } from './order.service';
import { TypeOrmModule } from "@nestjs/typeorm";
import { Order } from "./order";
import { SharedModule } from "../shared/shared.module";
import { LinkModule } from "../link/link.module";
import { ProductModule } from "../product/product.module";
import { UserModule } from 'src/user/user.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Order]),
        forwardRef(()=>LinkModule),
        forwardRef(()=>ProductModule),
        forwardRef(()=>UserModule),
        SharedModule,
    ],
    controllers: [],
    providers: [OrderService],
    exports: [OrderService]
})

export class OrderModule {
}
