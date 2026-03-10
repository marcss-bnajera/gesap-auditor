// =============================================
// GESAP Auditor - Punto de entrada
// Puerto 3001 - Prefijo: /gesap-auditor/v1
// =============================================

import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.setGlobalPrefix('gesap-auditor/v1');

    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
            transformOptions: { enableImplicitConversion: true },
        }),
    );

    app.enableCors({ origin: '*', credentials: true });

    const port = process.env.PORT || 3001;
    await app.listen(port);
    console.log(`GESAP Auditor ejecutandose en http://localhost:${port}/gesap-auditor/v1`);
}

bootstrap();