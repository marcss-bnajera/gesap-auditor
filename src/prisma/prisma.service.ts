// =============================================
// PrismaService
// Maneja la conexion con PostgreSQL a traves de Prisma
// Se conecta al iniciar y desconecta al cerrar la app
// =============================================

import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

const MAX_RETRIES = 10;
const RETRY_DELAY_MS = 3000;

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    async onModuleInit() {
        let attempt = 0;
        while (attempt < MAX_RETRIES) {
            try {
                await this.$connect();
                console.log('Prisma conectado a PostgreSQL');
                return;
            } catch (err) {
                attempt++;
                if (attempt >= MAX_RETRIES) throw err;
                console.log(`DB no disponible, reintentando (${attempt}/${MAX_RETRIES})...`);
                await new Promise((res) => setTimeout(res, RETRY_DELAY_MS));
            }
        }
    }

    async onModuleDestroy() {
        await this.$disconnect();
    }
}