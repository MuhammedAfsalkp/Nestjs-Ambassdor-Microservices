import {Injectable} from '@nestjs/common';
import {InjectDataSource, InjectEntityManager, InjectRepository} from "@nestjs/typeorm";
import {Product} from "./product";
import {DataSource, EntityManager, Repository} from "typeorm";
import {AbstractService} from "../shared/abstract.service";

@Injectable()
export class ProductService extends AbstractService {
    constructor(
        @InjectRepository(Product) private readonly productRepository: Repository<Product>,
    ) {
        super(productRepository);
    }
}
