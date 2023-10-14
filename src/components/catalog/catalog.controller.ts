import {
    Controller,
    ForbiddenException,
    Get,
    Inject,
    InternalServerErrorException,
    Logger,
    Param,
    Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ProductListDto } from '@/components/catalog/dto/product-list.dto';
import { GetProductListPgOperation } from '@/components/catalog/infrastructure/operation/get-product-list-pg.operation';
import { ProductListItemDto } from '@/components/catalog/dto/product-list-item.dto';
import { ValidateApiKeyService } from '@/shared/service/validate-api-key.service';
import { InvalidApiKeyException } from '@/components/catalog/domain/exception/invalid-api-key.exception';

@ApiBearerAuth('jwt')
@Controller()
export class CatalogController {
    private logger = new Logger(`CatalogController`);

    constructor(
        private readonly getProductsOperation: GetProductListPgOperation,
        @Inject(ValidateApiKeyService)
        private apiKeyService: ValidateApiKeyService,
    ) {}

    @Get('products')
    @ApiTags('catalog')
    @ApiOkResponse({ type: ProductListDto })
    @ApiQuery({ name: 'key', required: false })
    async getProducts(@Query('key') key: string): Promise<ProductListDto> {
        if (!this.apiKeyService.validate(key)) {
            this.handleError(new InvalidApiKeyException());
        }

        const result = await this.getProductsOperation.execute();

        if (result.isLeft()) {
            this.handleError(result.unsafeCoerce());
        }

        return new ProductListDto(
            result.unsafeCoerce().length,
            result.unsafeCoerce().map((product) => ProductListItemDto.fromEntity(product)),
        );
    }

    @Get('products/:code')
    @ApiTags('catalog')
    @ApiOkResponse({ type: ProductListDto })
    @ApiQuery({ name: 'key', required: false })
    async getProduct(@Param('code') code: string, @Query('key') key: string): Promise<ProductListItemDto> {
        if (!this.apiKeyService.validate(key)) {
            this.handleError(new InvalidApiKeyException());
        }

        const result = await this.getProductsOperation.execute(code);

        if (result.isLeft()) {
            this.handleError(result.unsafeCoerce());
        }

        return ProductListItemDto.fromEntity(result.unsafeCoerce()[0]);
    }

    private handleError(error: Error): void {
        this.logger.error(error.message, error.stack);

        if (error instanceof InvalidApiKeyException) {
            throw new ForbiddenException();
        }

        throw new InternalServerErrorException();
    }
}
