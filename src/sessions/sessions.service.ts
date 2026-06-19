// =============================================
// SessionsService
// Gestiona sesiones de login HTTP (polling)
// TODO: Migrar a Socket.io para tiempo real
// =============================================

import {
    Injectable, ForbiddenException, NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SessionsGateway } from './sessions.gateway';
import { HospitalScopedUser, getHospitalScope } from '../common/helpers/hospital-scope.helper';

@Injectable()
export class SessionsService {
    constructor(
        private prisma: PrismaService,
        private gateway: SessionsGateway,
    ) { }

    async findActive(currentUser: HospitalScopedUser) {
        const scope = getHospitalScope(currentUser);

        // TODO: Reemplazar polling con Socket.io
        // - Escuchar 'session.new' cuando alguien hace login
        // - Escuchar 'session.kicked' cuando se kickea una sesión
        try {
            const sessions = await this.prisma.loginSession.findMany({
                where: { isActive: true, ...scope },
                include: {
                    user: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            email: true,
                            role: { select: { name: true } },
                            hospital: { select: { id: true, name: true, code: true } },
                        },
                    },
                },
                orderBy: { loginAt: 'desc' },
                take: 100,
            });

            return sessions.map((s) => ({
                id: s.id,
                userId: s.userId,
                userName: `${s.user.firstName} ${s.user.lastName}`,
                userEmail: s.user.email,
                roleName: s.user.role.name,
                hospital: s.user.hospital,
                ipAddress: s.ipAddress,
                userAgent: s.userAgent,
                loginAt: s.loginAt,
                lastActiveAt: s.lastActiveAt,
                isActive: s.isActive,
            }));
        } catch {
            return [];
        }
    }

    async findByUser(currentUser: HospitalScopedUser, userId: number) {
        const scope = getHospitalScope(currentUser);
        try {
            return this.prisma.loginSession.findMany({
                where: { userId, ...scope },
                orderBy: { loginAt: 'desc' },
                take: 50,
            });
        } catch {
            return [];
        }
    }

    async findHistory(
        currentUser: HospitalScopedUser,
        filters: { from?: string; to?: string; isActive?: boolean },
    ) {
        const scope = getHospitalScope(currentUser);
        const where: Record<string, unknown> = { ...scope };

        if (filters.isActive !== undefined) where.isActive = filters.isActive;
        if (filters.from || filters.to) {
            where.loginAt = {};
            if (filters.from) (where.loginAt as Record<string, Date>).gte = new Date(filters.from);
            if (filters.to)   (where.loginAt as Record<string, Date>).lte = new Date(filters.to + 'T23:59:59');
        }

        try {
            const sessions = await this.prisma.loginSession.findMany({
                where,
                include: {
                    user: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            email: true,
                            role: { select: { name: true } },
                            hospital: { select: { id: true, name: true, code: true } },
                        },
                    },
                },
                orderBy: { loginAt: 'desc' },
                take: 500,
            });

            return sessions.map((s) => ({
                id: s.id,
                userId: s.userId,
                userName: `${s.user.firstName} ${s.user.lastName}`,
                userEmail: s.user.email,
                roleName: s.user.role.name,
                hospital: s.user.hospital,
                ipAddress: s.ipAddress,
                userAgent: s.userAgent,
                loginAt: s.loginAt,
                lastActiveAt: s.lastActiveAt,
                isActive: s.isActive,
            }));
        } catch {
            return [];
        }
    }

    async kick(sessionId: number, currentUser: HospitalScopedUser & { id: number }) {
        let session: { id: number; userId: number; isActive: boolean; user: { role: { name: string }; hospitalId: number | null } };

        try {
            session = await this.prisma.loginSession.findUnique({
                where: { id: sessionId },
                include: { user: { include: { role: true } } },
            }) as typeof session;
        } catch {
            throw new NotFoundException('Sesión no encontrada');
        }

        if (!session) throw new NotFoundException('Sesión no encontrada');
        if (!session.isActive) throw new ForbiddenException('La sesión ya está inactiva');
        if (session.userId === currentUser.id) throw new ForbiddenException('No puedes cerrar tu propia sesión');

        if (currentUser.roleName === 'AUDITOR') {
            const targetRole = session.user.role.name;
            if (['AUDITOR', 'SUPER_AUDITOR'].includes(targetRole)) {
                throw new ForbiddenException('No tienes permisos para cerrar la sesión de este usuario');
            }
            if (session.user.hospitalId !== currentUser.hospitalId) {
                throw new ForbiddenException('Este usuario no pertenece a tu hospital');
            }
        }

        await this.prisma.loginSession.update({
            where: { id: sessionId },
            data: { isActive: false },
        });

        // Notificar en tiempo real a todos los auditores conectados via WebSocket
        this.gateway.notifySessionsChanged();

        return { message: 'Sesión cerrada exitosamente' };
    }

    // Método para el gateway WebSocket (compatible con implementación anterior)
    async create(data: {
        userId: number;
        userEmail: string;
        socketId: string;
        deviceInfo?: string;
        ipAddress?: string;
        hospitalId?: number | null;
    }) {
        try {
            return this.prisma.session.create({ data });
        } catch {
            return null;
        }
    }

    async disconnect(socketId: string) {
        try {
            return this.prisma.session.updateMany({
                where: { socketId, isActive: true },
                data: { isActive: false, disconnectedAt: new Date() },
            });
        } catch {
            return null;
        }
    }
}
