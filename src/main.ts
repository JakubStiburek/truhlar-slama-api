import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import * as process from 'process';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.enableCors();
    app.useGlobalPipes(new ValidationPipe({ transform: true }));

    const config = new DocumentBuilder()
        .setTitle('truhlarslama.cz API')
        .setDescription('REST api for truhlarslama.cz application')
        .setVersion('0.0.1')
        .setBasePath('api/v1')
        .build();

    const document = SwaggerModule.createDocument(app, config);

    SwaggerModule.setup('doc', app, document);

    const PORT = process.env.PORT || 3000;

    await app.listen(PORT);
    console.log(`🎉 Application is running on port: ${PORT}`);
}

bootstrap();
