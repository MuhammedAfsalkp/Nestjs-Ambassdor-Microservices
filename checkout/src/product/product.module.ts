import {Module, forwardRef} from '@nestjs/common';
import {ProductService} from './product.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Product} from "./product";
import { UserModule } from 'src/user/user.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Product]),
        forwardRef(()=>UserModule)
    ],
    controllers: [],
    providers: [ProductService],
    exports: [ProductService]
})
export class ProductModule {
}
