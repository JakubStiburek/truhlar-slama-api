import { ProductListItemDto } from '@/components/catalog/dto/product-list-item.dto';
import { ApiProperty } from '@nestjs/swagger';

export class ProductListDto {
    @ApiProperty()
    readonly amount: number;
    @ApiProperty({ type: [ProductListItemDto] })
    readonly products: ProductListItemDto[];

    constructor(amount: number, products: ProductListItemDto[]) {
        this.amount = amount;
        this.products = products;
    }
}
