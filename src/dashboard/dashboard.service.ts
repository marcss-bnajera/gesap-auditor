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
            emergenciesPending,
            emergenciesInProgress,
            totalPatients,
            totalHospitals,
            unidentifiedPatients,
            pendingAccounts,
        ] = await Promise.all([
            this.prisma.user.count({ where: { isActive: true, ...scope } }),
            this.prisma.emergency.count({ where: { status: 'PENDING', ...emergencyScope } }),
            this.prisma.emergency.count({ where: { status: 'IN_PROGRESS', ...emergencyScope } }),
            this.prisma.patient.count({ where: { isActive: true } }),
            this.prisma.hospital.count({ where: { isActive: true } }),
            this.prisma.unidentifiedPatient.count({ where: { isActive: true, ...unidentifiedScope } }),
            this.prisma.patientAccount.count({ where: { status: 'PENDING' } }),
        ]);

        return {
            activeEmergencies: emergenciesPending + emergenciesInProgress,
            pendingAccounts,
            totalUsers,
            totalHospitals,
            totalPatients,
            unidentifiedPatients,
        };
    }
}
