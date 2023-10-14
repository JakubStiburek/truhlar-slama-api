import { Module } from '@nestjs/common';
import { CatalogController } from '@/components/catalog/catalog.controller';
import { DbService } from '@/shared/postgres/db.service';
import { ConfigModule } from '@nestjs/config';
import { GetProductListPgOperation } from '@/components/catalog/infrastructure/operation/get-product-list-pg.operation';
import { ValidateApiKeyService } from '@/shared/service/validate-api-key.service';
import { CreateProductPgOperation } from '@/components/catalog/infrastructure/operation/create-product-pg.operation';

@Module({
    imports: [ConfigModule],
    providers: [DbService, GetProductListPgOperation, CreateProductPgOperation, ValidateApiKeyService],
    controllers: [CatalogController],
})
export class CatalogModule {}
