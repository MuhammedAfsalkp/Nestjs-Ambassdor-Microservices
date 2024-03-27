import { Module, forwardRef } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { TypeOrmModule } from "@nestjs/typeorm";
import { OrderItem } from "./order-item";
import { Order } from "./order";
import { OrderItemService } from "./order-item.service";
import { LinkModule } from "../link/link.module";
import { ProductModule } from "../product/product.module";
import { UserModule } from 'src/user/user.module';
import { StripeModule } from 'nestjs-stripe';
import { ConfigService } from '@nestjs/config';
import { KafkaModule } from 'src/kafka/kafka.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Order, OrderItem]),
        forwardRef(()=>LinkModule),
        forwardRef(()=>ProductModule),
        forwardRef(()=>KafkaModule),
        forwardRef(()=>UserModule),
        StripeModule.forRootAsync({
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                apiKey: process.env.STRIPE_KEY,
                apiVersion: '2020-08-27',
            })
        }),
    ],
    controllers: [OrderController],
    providers: [OrderService, OrderItemService]
})

export class OrderModule {
}
