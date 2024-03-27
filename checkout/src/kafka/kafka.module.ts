import { Module, forwardRef } from '@nestjs/common';
import { KafkaService } from './kafka.service';
import { ClientsModule, Transport} from '@nestjs/microservices'
import { ProductModule } from 'src/product/product.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KafkaError } from './kafka-error';
import { LinkModule } from 'src/link/link.module';
import { KafkaController } from './kafka.controller';

@Module({
    imports: [
        TypeOrmModule.forFeature([KafkaError]),
        ClientsModule.register([{
        name: 'KAFKA_SERVICE',
        transport: Transport.KAFKA,
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
    forwardRef(()=>LinkModule)],
    controllers: [KafkaController],
    providers: [KafkaService],
    exports: [KafkaService]
})

export class KafkaModule {
}