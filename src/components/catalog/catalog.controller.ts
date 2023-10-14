import {
    BadRequestException,
    Body,
    Controller,
    ForbiddenException,
    Get,
    Inject,
    InternalServerErrorException,
    Logger,
    Param,
    Post,
    Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOkResponse, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ProductListDto } from '@/components/catalog/dto/product-list.dto';
import { GetProductListPgOperation } from '@/components/catalog/infrastructure/operation/get-product-list-pg.operation';
import { ProductListItemDto } from '@/components/catalog/dto/product-list-item.dto';
import { ValidateApiKeyService } from '@/shared/service/validate-api-key.service';
import { InvalidApiKeyException } from '@/components/catalog/domain/exception/invalid-api-key.exception';
import { ProductProps } from '@/components/catalog/domain/product-props.vo';
import { CreateProductPgOperation } from '@/components/catalog/infrastructure/operation/create-product-pg.operation';
import { ProductCodeDto } from '@/components/catalog/dto/product-code.dto';
import { ProductPropsDto } from '@/components/catalog/dto/product-props.dto';
import { ProductCode } from '@/components/catalog/domain/product-codoe.vo';
import { InvalidProductCodeProvidedException } from '@/components/catalog/domain/exception/invalid-product-code-provided.exception';

@ApiBearerAuth('jwt')
@Controller()
export class CatalogController {
    private logger = new Logger(`CatalogController`);

    constructor(
        private readonly getProductsOperation: GetProductListPgOperation,
        private readonly createProductOperation: CreateProductPgOperation,
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

    @Post('products')
    @ApiTags('catalog')
    @ApiOkResponse({ type: ProductCodeDto })
    @ApiBody({ type: ProductPropsDto })
    async createProduct(
        @Body() product: { title: string; description: string; price: number; amount: number; code: string },
    ): Promise<{ code: string }> {
        const productCode = new ProductCode(product.code);

        if (productCode.isValid().isLeft()) {
            this.handleError(productCode.isValid().leftToMaybe().unsafeCoerce());
        }

        const result = await this.createProductOperation.execute(
            new ProductProps(product.title, product.description, product.price, product.amount, product.code),
        );

        if (result.isLeft()) {
            this.handleError(result.leftToMaybe().unsafeCoerce());
        }

        return { code: result.unsafeCoerce() };
    }

    private handleError(error: Error): void {
        this.logger.error(error.message, error.stack);

        if (error instanceof InvalidApiKeyException) {
            throw new ForbiddenException();
        }

        if (error instanceof InvalidProductCodeProvidedException) {
            throw new BadRequestException(error.message);
        }

        throw new InternalServerErrorException();
    }
}
