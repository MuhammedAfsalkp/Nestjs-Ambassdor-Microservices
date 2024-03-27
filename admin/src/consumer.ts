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
    },
  );
  await app.listen();
}
bootstrap();