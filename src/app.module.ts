import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { CatalogModule } from '@/components/catalog/catalog.module';
import { ConfigModule } from '@nestjs/config';
import { LoggerMiddleware } from '@/shared/middleware/logger.middleware';
import { AuthModule } from '@/components/auth/auth.module';
import { AuthMiddleware } from '@/components/auth/auth.middleware';

@Module({
    imports: [CatalogModule, ConfigModule.forRoot(), AuthModule],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(LoggerMiddleware).forRoutes('*');
        consumer.apply(AuthMiddleware).forRoutes('api/v1/protected/*');
    }
}
