import { Controller, Inject, Logger } from "@nestjs/common";
import { Ctx, KafkaContext, MessagePattern, Payload } from "@nestjs/microservices";
import { KafkaMessage } from "kafkajs";
import { ProductService } from "src/product/product.service";
import {Cache} from 'cache-manager'
import { KafkaService } from "./kafka.service";
import { LinkService } from "src/link/link.service";

const logger =  new Logger(`KafkaController`)
@Controller()
export class KafkaController {
    constructor(private productService: ProductService, 
      private kafkaService: KafkaService,
      private linkService: LinkService
      ) {

    }

    @MessagePattern('checkout_topic')
    async event(@Payload() message: KafkaMessage, @Ctx() context: KafkaContext) {
      try{
        message = context.getMessage();
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
    }

    async productUpdated(data: any){
      logger.log( `product updating after recieving event`)
      await this.productService.update(data.id, data);
    }
    

    async productDeleted(data: any){
      logger.log( `product deleting after recieving event`)
      await this.productService.delete(data);
    }

    async linkCreated(data: any) {
      logger.log('creating link after reviving evenet', data)
      await this.linkService.save(data)
    }
    
}