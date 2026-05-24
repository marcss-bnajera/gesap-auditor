// =============================================
// EmergenciesService (Auditor — solo lectura)
// Monitoreo de emergencias filtrado por hospital
// =============================================

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { HospitalScopedUser } from '../common/helpers/hospital-scope.helper';

const EMERGENCY_INCLUDE = {
    patient: { select: { id: true, firstName: true, firstLastName: true, dpi: true } },
    unidentifiedPatient: { select: { id: true, sex: true, estimatedAge: true } },
    createdBy: { select: { id: true, firstName: true, lastName: true, email: true } },
    assignedTo: { select: { id: true, firstName: true, lastName: true, fleetId: true } },
    hospitalDestination: { select: { id: true, code: true, name: true } },
};

@Injectable()
export class EmergenciesService {
    constructor(private prisma: PrismaService) { }

    private emergencyScope(currentUser: HospitalScopedUser) {
        return currentUser.roleName === 'SUPER_AUDITOR'
            ? {}
            : { hospitalDestinationId: currentUser.hospitalId! };
    }

    async findAll(currentUser: HospitalScopedUser) {
        return this.prisma.emergency.findMany({
            where: this.emergencyScope(currentUser),
            include: EMERGENCY_INCLUDE,
            orderBy: { createdAt: 'desc' },
            take: 100,
        });
    }

    async findPending(currentUser: HospitalScopedUser) {
        return this.prisma.emergency.findMany({
            where: { status: 'PENDING', ...this.emergencyScope(currentUser) },
            include: EMERGENCY_INCLUDE,
            orderBy: { createdAt: 'asc' },
        });
    }

    async findOne(id: number) {
        const emergency = await this.prisma.emergency.findUnique({
            where: { id },
            include: {
                ...EMERGENCY_INCLUDE,
                patient: {
                    include: {
                        allergies: { where: { isActive: true } },
                        emergencyContacts: { where: { isActive: true } },
                    },
                },
            },
        });
        if (!emergency) throw new NotFoundException(`Emergencia con ID ${id} no encontrada`);
        return emergency;
    }
}
