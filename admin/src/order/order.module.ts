import { Module, forwardRef } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { TypeOrmModule } from "@nestjs/typeorm";
import { OrderItem } from "./order-item";
import { Order } from "./order";
import { OrderItemService } from "./order-item.service";
import { SharedModule } from "../shared/shared.module";
import { LinkModule } from "../link/link.module";
import { ProductModule } from "../product/product.module";
import { UserModule } from 'src/user/user.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Order, OrderItem]),
        SharedModule,
        forwardRef(()=> LinkModule),
        forwardRef(()=> ProductModule),
        forwardRef(()=> UserModule)
    ],
    controllers: [OrderController],
    providers: [OrderService, OrderItemService],
    exports: [OrderService, OrderItemService]
})

export class OrderModule {
}
