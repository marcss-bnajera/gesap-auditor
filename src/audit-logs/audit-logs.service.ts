// =============================================
// AuditLogsService
// Registra y consulta las acciones realizadas en el sistema
// =============================================

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { FilterAuditLogDto } from './dto/filter-audit-log.dto';
import { HospitalScopedUser, getHospitalScope } from '../common/helpers/hospital-scope.helper';

@Injectable()
export class AuditLogsService {
    constructor(private prisma: PrismaService) { }

    async create(data: {
        userId: number;
        userEmail: string;
        action: string;
        entity: string;
        entityId?: number;
        details?: any;
        ipAddress?: string;
        hospitalId?: number | null;
    }) {
        return this.prisma.auditLog.create({ data });
    }

    async findAll(currentUser: HospitalScopedUser, filters: FilterAuditLogDto) {
        const scope = getHospitalScope(currentUser);
        const where: any = { ...scope };

        if (filters.userId) where.userId = filters.userId;
        if (filters.action) where.action = filters.action;
        if (filters.entity) where.entity = filters.entity;

        if (filters.startDate || filters.endDate) {
            where.createdAt = {};
            if (filters.startDate) where.createdAt.gte = new Date(filters.startDate);
            if (filters.endDate) where.createdAt.lte = new Date(filters.endDate + 'T23:59:59');
        }

        return this.prisma.auditLog.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            take: 100,
        });
    }

    async getSummary(currentUser: HospitalScopedUser) {
        const scope = getHospitalScope(currentUser);

        const logs = await this.prisma.auditLog.groupBy({
            by: ['userEmail', 'action'],
            where: scope,
            _count: { id: true },
            orderBy: { _count: { id: 'desc' } },
        });

        return logs;
    }
}