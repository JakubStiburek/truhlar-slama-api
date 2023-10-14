import { Inject } from '@nestjs/common';
import { DbService } from '@/shared/postgres/db.service';
import { ProductProps } from '@/components/catalog/domain/product-props.vo';
import { Either, Left, Right } from 'purify-ts';
import { InvalidProductCodeProvidedException } from '@/components/catalog/domain/exception/invalid-product-code-provided.exception';

export class CreateProductPgOperation {
    constructor(
        @Inject(DbService)
        private db: DbService,
    ) {}

    async execute(props: ProductProps): Promise<Either<Error, string>> {
        try {
            const product = await this.db.sql<
                {
                    code: string;
                }[]
            >`INSERT INTO product (title, description, price, amount, code)
              VALUES (${props.title}, ${props.description},
                      ${props.price}, ${props.amount}, ${props.code})
              RETURNING code`;

            if (!product) {
                return Left(new Error('Error creating product'));
            }

            return Right(product[0].code);
        } catch (error) {
            if (error.code === '23505') {
                return Left(new InvalidProductCodeProvidedException('Product code already exists', props.code));
            }
            return Left(new Error('Error creating product'));
        }
    }
}
