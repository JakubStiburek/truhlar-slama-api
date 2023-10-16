import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import * as process from 'process';
import * as session from 'express-session';
import * as pgSession from 'connect-pg-simple';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    const pgSessionStore = pgSession(session);

    const sessionVariables = {
        connectionString: process.env.SESSION_CONNECTION_STRING,
        secret: process.env.SESSION_SECRET,
    };

    if (!sessionVariables.connectionString) {
        throw new Error('Missing session connection string');
    }

    if (!sessionVariables.secret) {
        throw new Error('Missing session secret');
    }

    app.enableCors();
    app.useGlobalPipes(new ValidationPipe({ transform: true }));

    app.use(
        session({
            store: new pgSessionStore({
                conObject: { connectionString: sessionVariables.connectionString },
                tableName: 'session',
            }),
            secret: sessionVariables.secret,
            resave: false,
            saveUninitialized: false,
            cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 }, // Session expires in 30 days
        }),
    );

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
