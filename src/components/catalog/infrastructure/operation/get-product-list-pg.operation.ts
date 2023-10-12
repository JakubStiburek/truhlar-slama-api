import { Inject } from '@nestjs/common';
import { DbService } from '@/shared/postgres/db.service';
import { Either, Left, Right } from 'purify-ts';
import { Product } from '@/components/catalog/domain/product.entity';

interface ProductPg {
    id: number;
    title: string;
    description: string;
    price: number;
    amount: number;
    code: string;
}

export class GetProductListPgOperation {
    constructor(
        @Inject(DbService)
        private db: DbService,
    ) {}

    async execute(code?: string): Promise<Either<Error, Product[]>> {
        try {
            const products = await this.db.sql<ProductPg[]>`SELECT *
                                                            FROM product ${
                                                                code ? this.db.sql`WHERE code = ${code}` : this.db.sql``
                                                            }`;

            if (!products) {
                return Left(new Error('Error getting products'));
            }

            const productIds = products.map((product) => product.id);

            const images = await this.db.sql<{ id: number; product_id: number; uri: string; type: string }[]>`select *
                                                                                                              from product_image
                                                                                                              where product_id in ${this.db.sql(
                                                                                                                  productIds,
                                                                                                              )}`;

            if (!images) {
                return Left(new Error('Error getting product images'));
            }

            const productsWithImages = products.map((product) => {
                const productImages = images.filter((image) => image.product_id === product.id);
                return new Product(
                    product.id,
                    product.title,
                    product.description,
                    product.price,
                    product.amount,
                    product.code,
                    productImages,
                );
            });

            return Right(productsWithImages);
        } catch (error) {
            console.error(error);
            return Left(new Error('Error getting product list'));
        }
    }
}
