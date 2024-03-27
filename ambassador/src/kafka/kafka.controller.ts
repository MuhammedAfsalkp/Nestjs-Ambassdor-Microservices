import { Controller, Inject, Logger } from "@nestjs/common";
import { Ctx, KafkaContext, MessagePattern, Payload } from "@nestjs/microservices";
import { KafkaMessage } from "kafkajs";
import { Product } from "src/product/product";
import { ProductService } from "src/product/product.service";
import { CACHE_MANAGER} from '@nestjs/cache-manager';
import {Cache} from 'cache-manager'
import { KafkaService } from "./kafka.service";
import { OrderService } from "src/order/order.service";

const logger =  new Logger(`KafkaController`)
@Controller()
export class KafkaController {
    constructor(private productService: ProductService, 
      @Inject(CACHE_MANAGER) private cacheManager: Cache,
      private kafkaService: KafkaService,
      private orderService: OrderService,
      ) {

    }

    @MessagePattern('ambassador_topic')
    async event(@Payload() message: KafkaMessage,@Ctx() context: KafkaContext) {
      try{
        message = context.getMessage();
        logger.log(message)
        logger.log('received event',message.key.toString())
        this[message.key.toString()](message.value)

      } catch(err) {
        logger.error(`error on event consumption`, err.message)
        logger.error('event',message.key.toString() )
        await  this.kafkaService.save({
          key: message.key.toString(),
          value: message.value,
          error: err.message
        })
      }
    }

    async productCreated(data: any){
      logger.log( `product creating after recieving event`)
      await this.productService.save(data);

      await this.cacheManager.del('products_frontend');
      await this.cacheManager.del('products_backend');
    }

    async productUpdated(data: any){
      logger.log( `product updating after recieving event`)
      await this.productService.update(data.id, data);

      await this.cacheManager.del('products_frontend');
      await this.cacheManager.del('products_backend');
    }
    

    async productDeleted(data: any){
      logger.log( `product deleting after recieving event`)
      await this.productService.delete(data);
      await this.cacheManager.del('products_frontend');
      await this.cacheManager.del('products_backend');
    }

    async orderCompleted(data: any){
      logger.log('creating order after reviving evenet', data)
      await this.orderService.save({
        id: data.id,
        code: data.code,
        user_id: data.user_id,
        total: data.ambassador_revenue
      })
    }

    
}