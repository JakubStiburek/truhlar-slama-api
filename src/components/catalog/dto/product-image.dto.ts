import { ApiProperty } from '@nestjs/swagger';
import { ProductImage } from '@/components/catalog/domain/product-image.entity';

export class ProductImageDto {
    @ApiProperty()
    readonly id: number;

    @ApiProperty()
    readonly uri: string;

    @ApiProperty()
    readonly type: string;

    constructor(id: number, uri: string, type: string) {
        this.id = id;
        this.uri = uri;
        this.type = type;
    }

    static fromEntity(entity: ProductImage): ProductImageDto {
        return new ProductImageDto(entity.id, entity.uri, entity.type);
    }
}
