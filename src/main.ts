// =============================================
// GESAP Auditor - Punto de entrada
// Puerto 3001 - Prefijo: /gesap-auditor/v1
// =============================================

import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
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

    const swaggerConfig = new DocumentBuilder()
        .setTitle('GESAP Auditor')
        .setDescription('Panel de administración del Sistema GESAP. Permite a AUDITOR y SUPER_AUDITOR gestionar usuarios, hospitales, emergencias, dispositivos, sesiones, horarios y cuentas de pacientes.')
        .setVersion('1.0')
        .addBearerAuth(
            { type: 'http', scheme: 'bearer', bearerFormat: 'JWT', in: 'header' },
            'JWT',
        )
        .addTag('Auth', 'Validación de token')
        .addTag('Dashboard', 'Estadísticas y resumen del sistema')
        .addTag('Users', 'Gestión de usuarios por hospital')
        .addTag('Hospitals', 'Gestión de hospitales (solo SUPER_AUDITOR)')
        .addTag('Emergencies', 'Monitoreo de emergencias (solo lectura)')
        .addTag('Patient Accounts', 'Aprobación/rechazo de cuentas de pacientes')
        .addTag('Sessions', 'Sesiones activas de usuarios')
        .addTag('Devices', 'Dispositivos autorizados (whitelist)')
        .addTag('Schedules', 'Horarios de trabajo de usuarios')
        .addTag('Audit Logs', 'Registros de auditoría del sistema')
        .build();

    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('gesap-auditor/v1/docs', app, document, {
        swaggerOptions: { persistAuthorization: true },
    });

    const port = process.env.PORT || 3001;
    await app.listen(port);
    console.log(`GESAP Auditor ejecutandose en http://localhost:${port}/gesap-auditor/v1`);
    console.log(`Swagger disponible en http://localhost:${port}/gesap-auditor/v1/docs`);
}

bootstrap();