import { Controller, Get } from '@nestjs/common';
import {MailerService} from "@nestjs-modules/mailer";
import { MessagePattern, Payload, Ctx, KafkaContext } from '@nestjs/microservices';
import { KafkaMessage ,} from 'kafkajs';

@Controller()
export class AppController {
  constructor(
    private mailerService: MailerService) {}
  
  @MessagePattern('email_topic')
  async orderComplated(@Payload() message: KafkaMessage, @Ctx() context: KafkaContext){
    message = context.getMessage();
    console.log('received event',message.key.toString())
    this[message.key.toString()](message.value)
    
    const order: any = message;
    await this.mailerService.sendMail({
      to: 'admin@admin.com',
      subject: 'An order has been completed',
      html: `Order #${order.id} with a total of $${order.total} has been completed!`
  })

  await this.mailerService.sendMail({
      to: order.ambassador_email,
      subject: 'An order has been completed',
      html: `You earned $${order.ambassador_revenue} from the link #${order.code}`
  })

  }

  async productCreated(data: any){
    console.log( `product creating after recieving event:${data}`)
    
  }
}
