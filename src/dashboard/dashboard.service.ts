// =============================================
// DashboardService
// Estadisticas del sistema filtradas por hospital
// =============================================

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { HospitalScopedUser, getHospitalScope } from '../common/helpers/hospital-scope.helper';

@Injectable()
export class DashboardService {
    constructor(private prisma: PrismaService) { }

    async getStats(currentUser: HospitalScopedUser) {
        const scope = getHospitalScope(currentUser);
        // emergencias filtran por hospitalDestinationId, no hospitalId
        const emergencyScope = scope.hospitalId
            ? { hospitalDestinationId: scope.hospitalId }
            : {};
        // pacientes sin identificar filtran por hospitalId directo
        const unidentifiedScope = scope.hospitalId
            ? { hospitalId: scope.hospitalId }
            : {};

        const [
            totalUsers,
            activeSessions,
            emergenciesPending,
            emergenciesInProgress,
            emergenciesCompleted,
            totalPatients,
            totalAuditLogs,
            unidentifiedPatients,
            receptionStaff,
        ] = await Promise.all([
            this.prisma.user.count({ where: { isActive: true, ...scope } }),
            this.prisma.session.count({ where: { isActive: true, ...scope } }),
            this.prisma.emergency.count({ where: { status: 'PENDING', ...emergencyScope } }),
            this.prisma.emergency.count({ where: { status: 'IN_PROGRESS', ...emergencyScope } }),
            this.prisma.emergency.count({ where: { status: 'COMPLETED', ...emergencyScope } }),
            this.prisma.patient.count({ where: { isActive: true } }),
            this.prisma.auditLog.count({ where: scope }),
            this.prisma.unidentifiedPatient.count({ where: { isActive: true, ...unidentifiedScope } }),
            // Estado de disponibilidad de ASISTENTE_RECEPCION_CLINICA del hospital
            this.prisma.user.findMany({
                where: {
                    isActive: true,
                    ...scope,
                    role: { name: 'ASISTENTE_RECEPCION_CLINICA' },
                },
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    availabilityStatus: true,
                },
            }),
        ]);

        const receptionByStatus = {
            available: receptionStaff.filter(u => u.availabilityStatus === 'AVAILABLE').length,
            busy: receptionStaff.filter(u => u.availabilityStatus === 'BUSY').length,
            offline: receptionStaff.filter(u => u.availabilityStatus === 'OFFLINE').length,
            total: receptionStaff.length,
            detail: receptionStaff,
        };

        return {
            users: { total: totalUsers },
            sessions: { active: activeSessions },
            emergencies: {
                total: emergenciesPending + emergenciesInProgress + emergenciesCompleted,
                pending: emergenciesPending,
                inProgress: emergenciesInProgress,
                completed: emergenciesCompleted,
            },
            patients: { total: totalPatients },
            unidentifiedPatients: { active: unidentifiedPatients },
            auditLogs: { total: totalAuditLogs },
            receptionAvailability: receptionByStatus,
        };
    }
}
