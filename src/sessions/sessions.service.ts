// =============================================
// SessionsService
// Gestiona las sesiones activas de usuarios
// =============================================

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { HospitalScopedUser, getHospitalScope } from '../common/helpers/hospital-scope.helper';

@Injectable()
export class SessionsService {
    constructor(private prisma: PrismaService) { }

    async create(data: {
        userId: number;
        userEmail: string;
        socketId: string;
        deviceInfo?: string;
        ipAddress?: string;
        hospitalId?: number | null;
    }) {
        return this.prisma.session.create({ data });
    }

    async disconnect(socketId: string) {
        return this.prisma.session.updateMany({
            where: { socketId, isActive: true },
            data: { isActive: false, disconnectedAt: new Date() },
        });
    }

    async findActive(currentUser: HospitalScopedUser) {
        const scope = getHospitalScope(currentUser);
        return this.prisma.session.findMany({
            where: { isActive: true, ...scope },
            orderBy: { connectedAt: 'desc' },
        });
    }

    async findByUser(currentUser: HospitalScopedUser, userId: number) {
        const scope = getHospitalScope(currentUser);
        return this.prisma.session.findMany({
            where: { userId, ...scope },
            orderBy: { connectedAt: 'desc' },
            take: 50,
        });
    }
}