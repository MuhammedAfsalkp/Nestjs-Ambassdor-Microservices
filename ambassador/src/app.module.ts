import { Module, forwardRef } from '@nestjs/common';
import { AppController } from './app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { ProductModule } from './product/product.module';
import { LinkModule } from './link/link.module';
import { OrderModule } from './order/order.module';
import { KafkaModule } from './kafka/kafka.module';


@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      autoLoadEntities: true,
      synchronize: true,
    }),
    // TypeOrmModule.forRoot({
    //   type: 'mysql',
    //   host: '34.93.151.246',
    //   port: 3306,
    //   username: 'root',
    //   password: 'root',
    //   database: 'ambassador',
    //   autoLoadEntities: true,
    //   synchronize: true,
    // }),
    forwardRef(()=>UserModule),
    forwardRef(()=>ProductModule),
    forwardRef(()=>LinkModule),
    forwardRef(()=>OrderModule),
    forwardRef(()=>KafkaModule)
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
