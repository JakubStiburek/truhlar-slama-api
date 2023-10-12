import { Controller, Get, Logger } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ProductListDto } from '@/components/catalog/dto/product-list.dto';
import { GetProductListPgOperation } from '@/components/catalog/infrastructure/operation/get-product-list-pg.operation';
import { ProductListItemDto } from '@/components/catalog/dto/product-list-item.dto';

@ApiBearerAuth('jwt')
@Controller()
export class CatalogController {
    private logger = new Logger(`CatalogController`);

    constructor(private readonly getProductsOperation: GetProductListPgOperation) {}

    @Get('products')
    @ApiTags('catalog')
    @ApiOkResponse({ type: ProductListDto })
    async getProducts(): Promise<ProductListDto> {
        const result = await this.getProductsOperation.execute();

        if (result.isLeft()) {
            this.handleError(result.unsafeCoerce());
        }

        return new ProductListDto(
            result.unsafeCoerce().length,
            result.unsafeCoerce().map((product) => ProductListItemDto.fromEntity(product)),
        );
    }

    private handleError(error: Error): void {
        this.logger.error(error.message, error.stack);
        throw error;
    }
}
