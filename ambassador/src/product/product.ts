import {Column, Entity, PrimaryColumn, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class Product {
    @PrimaryColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    description: string;

    @Column()
    image: string;

    @Column()
    price: number;
}
