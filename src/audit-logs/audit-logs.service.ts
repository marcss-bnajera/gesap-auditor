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
        if (filters.action) where.action = { contains: filters.action, mode: 'insensitive' };
        if (filters.entity) where.entity = { contains: filters.entity, mode: 'insensitive' };

        if (filters.from || filters.to) {
            where.createdAt = {};
            if (filters.from) where.createdAt.gte = new Date(filters.from);
            if (filters.to) where.createdAt.lte = new Date(filters.to + 'T23:59:59');
        }

        const logs = await this.prisma.auditLog.findMany({
            where,
            include: {
                hospital: { select: { id: true, name: true } },
            },
            orderBy: { createdAt: 'desc' },
            take: 200,
        });

        if (logs.length === 0) return [];

        // Join de usuario manual (audit_logs no tiene FK a users para preservar histórico)
        const userIds = [...new Set(logs.map((l) => l.userId))];
        const users = await this.prisma.user.findMany({
            where: { id: { in: userIds } },
            select: { id: true, firstName: true, lastName: true, email: true },
        });
        const userMap = new Map(users.map((u) => [u.id, u]));

        return logs.map((l) => ({ ...l, user: userMap.get(l.userId) ?? null }));
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
