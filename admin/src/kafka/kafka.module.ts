import { Module, forwardRef } from '@nestjs/common';
import { KafkaService } from './kafka.service';
import { ClientsModule, Transport } from '@nestjs/microservices'
import { LinkModule } from 'src/link/link.module';
import { OrderModule } from 'src/order/order.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KafkaError } from './kafka-error';
import { KafkaController } from './kafka.controller';
import { ConfigModule } from '@nestjs/config';
// import * as dotenv from 'dotenv';
// dotenv.config()


@Module({
  imports: [
    // ConfigModule.forRoot({
    //   isGlobal: true,
    // }),
    ClientsModule.register([{
    name: 'KAFKA_SERVICE',
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: [process.env.BOOTSTRAP_SERVERS],
        ssl: true,
        sasl: {
          mechanism: 'plain',
          username: process.env.SASL_USERNAME,
          password: process.env.SASL_PASSWORD
        }
      },
    }
  }]),
    LinkModule,
  forwardRef(() => OrderModule),
  TypeOrmModule.forFeature([KafkaError])],
  providers: [KafkaService],
  controllers: [KafkaController],
  exports: [KafkaService]
})

export class KafkaModule {
}