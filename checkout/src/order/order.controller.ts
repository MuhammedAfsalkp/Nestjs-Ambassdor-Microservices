import {
    BadRequestException,
    Body,
    ClassSerializerInterceptor,
    Controller,
    Logger,
    NotFoundException,
    Post,
    UseInterceptors
} from '@nestjs/common';
import {OrderService} from "./order.service";
import { CreateOrderDto } from './dtos/create-order.dto';
import { Link } from 'src/link/link';
import { LinkService } from 'src/link/link.service';
import { UserService } from 'src/user/user.service';
import {Connection} from "typeorm";
import { Order } from './order';
import { Product } from 'src/product/product';
import { ProductService } from 'src/product/product.service';
import { OrderItem } from './order-item';
import { InjectStripe } from 'nestjs-stripe';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { KafkaService } from 'src/kafka/kafka.service';

const logger = new Logger('OrderController')


@Controller('orders')
@UseInterceptors(ClassSerializerInterceptor)
export class OrderController {
    constructor(
        private orderService: OrderService,
        private linkService: LinkService,
        private userService: UserService,
        private connection: Connection,
        private productService: ProductService,
        @InjectStripe() private readonly stripeClient: Stripe,
        private configService: ConfigService,
        private kafkaService: KafkaService
    ) {
    }

    @Post()
    async create(@Body() body: CreateOrderDto) {
        logger.log(`request to create order: ${body}`)
        const link: Link = await this.linkService.findOne({
            where: {code: body.code},
        });
        if (!link) {
            throw new BadRequestException('Invalid link!');
        }
         logger.log(`got link: ${JSON.stringify(link)}`)
        const user = await this.userService.get(`users/${link.user_id}`);

       logger.log(`user: ${JSON.stringify(user)}`)
        const queryRunner = this.connection.createQueryRunner();

        try {
            await queryRunner.connect();
            await queryRunner.startTransaction();

            const o = new Order();
            o.user_id = link.user_id;
            o.ambassador_email = user['email'];
            o.first_name = body.first_name;
            o.last_name = body.last_name;
            o.email = body.email;
            o.address = body.address;
            o.country = body.country;
            o.city = body.city;
            o.zip = body.zip;
            o.code = body.code;

            const order = await queryRunner.manager.save(o);
            logger.log(`initial ordr creation has completed`)

            const line_items = [];

            for (let p of body.products) {
                const product: Product = await this.productService.findOne({where: {
                    id: p.product_id
                }});
                logger.log(`recieved product: ${product}`)
                const orderItem = new OrderItem();
                orderItem.order = order;
                orderItem.product_title = product.title;
                orderItem.price = product.price;
                orderItem.quantity = p.quantity;
                orderItem.ambassador_revenue = 0.1 * product.price * p.quantity;
                orderItem.admin_revenue = 0.9 * product.price * p.quantity;

                await queryRunner.manager.save(orderItem);
                const lineItem = {
                    name: product.title,
                    description: product.description,
                    amount: 100 * product.price,
                    currency: 'usd',
                    quantity: p.quantity
                }
                if(product?.image && product.image.length > 5){
                    lineItem['images'] = [product.image]
                }

                line_items.push(lineItem)
            }
             logger.log(`creating stripe session source${JSON.stringify(line_items)}`)
            const source = await this.stripeClient.checkout.sessions.create({
                payment_method_types: ['card'],
                line_items,
                success_url: `${process.env.CHECKOUT_URL}/success?source={CHECKOUT_SESSION_ID}`,
                cancel_url: `${process.env.CHECKOUT_URL}/error`
            });
            logger.log(`succefully created source: ${JSON.stringify(source)}`)
            order.transaction_id = source['id'];
            await queryRunner.manager.save(order);

            await queryRunner.commitTransaction();
            logger.log`successfully created order`
            return source;
        } catch (e) {
            await queryRunner.rollbackTransaction();
            logger.log(e, 'error on transaction ')

            throw new BadRequestException();
        } finally {
            await queryRunner.release();
        }
    }

    @Post('confirm')
    async confirm(@Body('source') source: string) {
        const order = await this.orderService.findOne({
            where: {transaction_id: source},
            relations: ['order_items']
        });

        if (!order) {
            throw new NotFoundException('Order not found');
        }

        await this.orderService.update(order.id, {complete: true});
        await this.kafkaService.emit(['admin_topic', 'ambassador_topic', 'email_topic'],'orderCompleted',{
            ...order,
            complete: true,
            total: order.total,
            ambassador_revenue: order.ambassador_revenue
        })

        return {
            message: 'success'
        }
    }

}
