import { ProductImage } from '@/components/catalog/domain/product-image.entity';
import { ProductProps } from '@/components/catalog/domain/product-props.vo';

export class Product {
    constructor(readonly id: number, readonly props: ProductProps, readonly images: ProductImage[]) {}
}
