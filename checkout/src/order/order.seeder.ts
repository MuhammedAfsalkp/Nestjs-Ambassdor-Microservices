import {NestFactory} from "@nestjs/core";
import {AppModule} from "../app.module";
import {randomInt} from "crypto";
import {OrderService} from "../order/order.service";
import {OrderItemService} from "../order/order-item.service";
import { createConnection } from "typeorm";
import { Link } from "src/link/link";
import { Product } from "src/product/product";
import { Order } from "./order";
import { OrderItem } from "./order-item";

(async () => {
    const app = await NestFactory.createApplicationContext(AppModule);

    const orderService = app.get(OrderService);
    const orderItemService = app.get(OrderItemService);
    const connection = await createConnection({
        name: 'old',
        type: 'mysql',
        host: 'db',
        port: 3306,
        username: 'root',
        password: 'root',
        database: 'ambassodor',
        entities: [Link, Product, Order, OrderItem],
      });
      const orders = await connection.manager.find(Order,{
        relations: ['order_items']
      })
    for (let i = 0; i < orders.length; i++) {
        const order = await orderService.save(orders[i]);
    }

    process.exit();
})();
