// =============================================
// SessionsService
// Gestiona las sesiones activas de usuarios
// =============================================

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SessionsService {
    constructor(private prisma: PrismaService) { }

    // Registrar nueva sesion cuando un usuario se conecta via Socket.io
    async create(data: {
        userId: number;
        userEmail: string;
        socketId: string;
        deviceInfo?: string;
        ipAddress?: string;
    }) {
        return this.prisma.session.create({ data });
    }

    // Marcar sesion como desconectada
    async disconnect(socketId: string) {
        return this.prisma.session.updateMany({
            where: { socketId, isActive: true },
            data: { isActive: false, disconnectedAt: new Date() },
        });
    }

    // Listar sesiones activas
    async findActive() {
        return this.prisma.session.findMany({
            where: { isActive: true },
            orderBy: { connectedAt: 'desc' },
        });
    }

    // Obtener historial de sesiones de un usuario
    async findByUser(userId: number) {
        return this.prisma.session.findMany({
            where: { userId },
            orderBy: { connectedAt: 'desc' },
            take: 50,
        });
    }
}