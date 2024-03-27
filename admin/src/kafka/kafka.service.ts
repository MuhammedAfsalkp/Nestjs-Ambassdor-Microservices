import { Inject, Injectable, Logger } from "@nestjs/common";
import { ClientKafka } from "@nestjs/microservices";
import { InjectRepository } from "@nestjs/typeorm";
import { KafkaError } from "./kafka-error";
import { Repository } from "typeorm";

const logger = new Logger('KafkaService')

@Injectable()
export class KafkaService {
    constructor(
        @InjectRepository(KafkaError) private readonly kafkaRepository: Repository<KafkaError>,
        @Inject('KAFKA_SERVICE') private client: ClientKafka) {

    }

    async emit(topic: string[], key: string, value: any){
        for(let i=0; i<topic.length; i++) {
            logger.log(`emiting to topic: ${topic[i]}`,)
            logger.log(`key: ${key}, value: ${value}`)
            await this.client.emit(topic[i],{
                key,
                value: JSON.stringify(value)
            })
        }
    }

    async save(data: any){
        return this.kafkaRepository.save(data)
    }
}