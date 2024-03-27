import { Module, forwardRef } from '@nestjs/common';
import { KafkaService } from './kafka.service';
import { ClientsModule, Transport} from '@nestjs/microservices'
import { ProductModule } from 'src/product/product.module';
import { SharedModule } from 'src/shared/shared.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KafkaError } from './kafka-error';
import { OrderModule } from 'src/order/order.module';
import { KafkaController } from './kafka.controller';

@Module({
    imports: [
        TypeOrmModule.forFeature([KafkaError]),
        ClientsModule.register([{
        name: 'KAFKA_SERVICE',
        transport: Transport.KAFKA,
        // options: {
        //   client: {    
        //     brokers: ['pkc-41p56.asia-south1.gcp.confluent.cloud:9092'],
        //     ssl: true,
        //     sasl: {
        //       mechanism:'plain',
        //       username: '442V3XBIVI6K43UW',
        //       password: 'qT7k8wzjXZQY+X2B2Jfakb3b/VrGNfpugthG3JFZRRx4hLNuci79DSGV8kGM1Kix'
  
        //     }
        //   },
        //   consumer: {
        //     groupId: 'ambassador_consumer'
        //   }
        // },
        options: {
            client: {    
              brokers: [process.env.BOOTSTRAP_SERVERS],
              ssl: true,
              sasl: {
                mechanism:'plain',
                username: process.env.SASL_USERNAME,
                password: process.env.SASL_PASSWORD
    
              }
            },
          },

    }]),
    forwardRef(()=>ProductModule),
    forwardRef(()=>OrderModule),
    SharedModule],
    providers: [KafkaService],
    controllers:[KafkaController],
    exports: [KafkaService]
})

export class KafkaModule {
}