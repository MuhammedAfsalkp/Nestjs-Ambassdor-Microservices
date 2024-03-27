import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
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
        consumer: {
          groupId: process.env.GROUP_ID
        }
      },
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
    },
  );
  await app.listen();
}
bootstrap();