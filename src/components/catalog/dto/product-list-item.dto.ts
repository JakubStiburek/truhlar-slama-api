import { ApiProperty } from '@nestjs/swagger';
import { Product } from '@/components/catalog/domain/product.entity';
import { ProductImageDto } from '@/components/catalog/dto/product-image.dto';
import { ProductImage } from '@/components/catalog/domain/product-image.entity';

export class ProductListItemDto {
    @ApiProperty()
    readonly id: number;
    @ApiProperty()
    readonly title: string;
    @ApiProperty()
    readonly description: string;
    @ApiProperty()
    readonly price: number;
    @ApiProperty()
    readonly amount: number;
    @ApiProperty()
    readonly code: string;
    @ApiProperty({ type: [ProductImageDto] })
    readonly images: ProductImageDto[];

    constructor(
        id: number,
        title: string,
        description: string,
        price: number,
        amount: number,
        code: string,
        images: ProductImage[],
    ) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.price = price;
        this.amount = amount;
        this.code = code;
        this.images = images.map((image) => ProductImageDto.fromEntity(image));
    }

    static fromEntity(entity: Product): ProductListItemDto {
        return new ProductListItemDto(
            entity.id,
            entity.props.title,
            entity.props.description,
            entity.props.price,
            entity.props.amount,
            entity.props.code,
            entity.images,
        );
    }
}
