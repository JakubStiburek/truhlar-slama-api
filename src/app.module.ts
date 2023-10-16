import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { CatalogModule } from '@/components/catalog/catalog.module';
import { ConfigModule } from '@nestjs/config';
import { LoggerMiddleware } from '@/shared/middleware/logger.middleware';
import { AuthModule } from '@/components/auth/auth.module';

@Module({
    imports: [CatalogModule, ConfigModule.forRoot(), AuthModule],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(LoggerMiddleware).forRoutes('*');
    }
}
