import { Controller, Logger } from "@nestjs/common";
import { Ctx, KafkaContext, MessagePattern, Payload } from "@nestjs/microservices";
import { KafkaMessage } from "kafkajs";
import { LinkService } from "src/link/link.service";
import { Product } from "src/product/product";
import { KafkaService } from "./kafka.service";
import { OrderService } from "src/order/order.service";



const logger = new Logger(`Kafkacontroller`)

@Controller()
export class KafkaController {
  constructor(private linkService: LinkService,
    private kafkaService: KafkaService,
    private orderService: OrderService) {

  }

  @MessagePattern('admin_topic')
  async event(@Payload() message: KafkaMessage, @Ctx() context: KafkaContext) {
    try {
      message = context.getMessage();
      logger.log('received event', message.key.toString())
      this[message.key.toString()](message.value)

    } catch (err) {
      logger.error(`error on event consumption`, err.message)
      logger.error('event', message.key.toString())
      await this.kafkaService.save({
        key: message.key.toString(),
        value: message.value,
        error: err.message
      })
    }

  }


  async linkCreated(data: any) {
    logger.log('creating link after reviving evenet', data)
    await this.linkService.save(data)
  }

  async orderCompleted(data: any){
    logger.log('creating order after reviving evenet', data)
    await this.orderService.save(data)
  }

}