// =============================================
// AuditLogsService
// Registra y consulta las acciones realizadas en el sistema
// =============================================

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { FilterAuditLogDto } from './dto/filter-audit-log.dto';

@Injectable()
export class AuditLogsService {
    constructor(private prisma: PrismaService) { }

    // Registrar una accion en el log
    async create(data: {
        userId: number;
        userEmail: string;
        action: string;
        entity: string;
        entityId?: number;
        details?: any;
        ipAddress?: string;
    }) {
        return this.prisma.auditLog.create({ data });
    }

    // Listar logs con filtros opcionales
    async findAll(filters: FilterAuditLogDto) {
        const where: any = {};

        if (filters.userId) where.userId = filters.userId;
        if (filters.action) where.action = filters.action;
        if (filters.entity) where.entity = filters.entity;

        // Filtro por rango de fechas
        if (filters.startDate || filters.endDate) {
            where.createdAt = {};
            if (filters.startDate) where.createdAt.gte = new Date(filters.startDate);
            if (filters.endDate) where.createdAt.lte = new Date(filters.endDate + 'T23:59:59');
        }

        return this.prisma.auditLog.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            take: 100, // Limitar a 100 registros por consulta
        });
    }

    // Obtener resumen de acciones por usuario
    async getSummary() {
        const logs = await this.prisma.auditLog.groupBy({
            by: ['userEmail', 'action'],
            _count: { id: true },
            orderBy: { _count: { id: 'desc' } },
        });

        return logs;
    }
}