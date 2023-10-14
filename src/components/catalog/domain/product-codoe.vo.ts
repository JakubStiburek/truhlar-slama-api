import { Either, Left, Right } from 'purify-ts';
import { InvalidProductCodeProvidedException } from '@/components/catalog/domain/exception/invalid-product-code-provided.exception';

export class ProductCode {
    constructor(readonly value: string) {}

    isValid(): Either<Error, true> {
        if (this.value.includes(' ')) {
            return Left(new InvalidProductCodeProvidedException('Product code cannot contain spaces', this.value));
        }
        if (this.value.length === 0) {
            return Left(new InvalidProductCodeProvidedException('Product code cannot be empty', this.value));
        }
        if (!this.value.match(/\d{2}$/)) {
            return Left(
                new InvalidProductCodeProvidedException(
                    'Product code must have number as the last 2 characters',
                    this.value,
                ),
            );
        }
        if (this.value.match(/\d/g)?.length !== 2) {
            return Left(
                new InvalidProductCodeProvidedException('Product code must have exactly 2 numbers', this.value),
            );
        }
        if (!this.value.match(/_/)) {
            return Left(
                new InvalidProductCodeProvidedException('Product code must contain at least 1 underscore', this.value),
            );
        }

        return Right(true);
    }
}
