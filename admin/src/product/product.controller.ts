import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
    UseGuards,
    Logger
} from '@nestjs/common';
import { ProductService } from "./product.service";
import { ProductCreateDto } from "./dtos/product-create.dto";
import { AuthGuard } from "../user/auth.guard";
import { KafkaService } from 'src/kafka/kafka.service';

const logger = new Logger('ProductController')

@Controller('products')
export class ProductController {
    constructor(
        private readonly productService: ProductService,
        private readonly kafkaService: KafkaService
    ) {
    }

    @UseGuards(AuthGuard)
    @Get()
    async all() {
        return this.productService.find();
    }

    @UseGuards(AuthGuard)
    @Post()
    async create(@Body() body: ProductCreateDto) {
        logger.log('creating product', body)
        const product = await this.productService.save(body);
        await this.kafkaService.emit(['ambassador_topic', 'checkout_topic'], 'productCreated', product)
        return product;
    }

    @UseGuards(AuthGuard)
    @Get(':id')
    async get(@Param('id') id: number) {
        return this.productService.findOne({ id });
    }

    @UseGuards(AuthGuard)
    @Put(':id')
    async update(
        @Param('id') id: number,
        @Body() body: ProductCreateDto
    ) {
        await this.productService.update(id, body);
        const product = await this.productService.findOne({ id });
        await this.kafkaService.emit(['ambassador_topic', 'checkout_topic'], 'productUpdated', product);
        return product;
    }

    @UseGuards(AuthGuard)
    @Delete(':id')
    async delete(@Param('id') id: number) {
        const response = await this.productService.delete(id);
        await this.kafkaService.emit(['ambassador_topic', 'checkout_topic'], 'productDeleted', id)
        return response;
    }
}
