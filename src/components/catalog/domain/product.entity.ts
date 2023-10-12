import { ProductImage } from '@/components/catalog/domain/product-image.entity';

export class Product {
    constructor(
        readonly id: number,
        readonly title: string,
        readonly description: string,
        readonly price: number,
        readonly amount: number,
        readonly code: string,
        readonly images: ProductImage[],
    ) {}
}
