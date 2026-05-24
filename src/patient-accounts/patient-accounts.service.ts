// =============================================
// PatientAccountsService
// Aprobacion y rechazo de cuentas de pacientes
// Solo AUDITOR (su hospital) y SUPER_AUDITOR (todas)
// =============================================

import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PatientAccountsService {
    constructor(private prisma: PrismaService) { }

    async findPending() {
        return this.prisma.patientAccount.findMany({
            where: { status: 'PENDING' },
            orderBy: { createdAt: 'asc' },
        });
    }

    async findAll() {
        return this.prisma.patientAccount.findMany({
            orderBy: { createdAt: 'desc' },
        });
    }

    async approve(id: number, approvedBy: number) {
        const account = await this.prisma.patientAccount.findUnique({ where: { id } });
        if (!account) throw new NotFoundException(`Cuenta con ID ${id} no encontrada`);
        if (account.status !== 'PENDING') {
            throw new BadRequestException(`La cuenta ya fue ${account.status === 'APPROVED' ? 'aprobada' : 'rechazada'}`);
        }

        return this.prisma.patientAccount.update({
            where: { id },
            data: { status: 'APPROVED', approvedBy, approvedAt: new Date() },
        });
    }

    async reject(id: number, rejectedBy: number) {
        const account = await this.prisma.patientAccount.findUnique({ where: { id } });
        if (!account) throw new NotFoundException(`Cuenta con ID ${id} no encontrada`);
        if (account.status !== 'PENDING') {
            throw new BadRequestException(`La cuenta ya fue ${account.status === 'APPROVED' ? 'aprobada' : 'rechazada'}`);
        }

        return this.prisma.patientAccount.update({
            where: { id },
            data: { status: 'REJECTED', approvedBy: rejectedBy, approvedAt: new Date() },
        });
    }
}
