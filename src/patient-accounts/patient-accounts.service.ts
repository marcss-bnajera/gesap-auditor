import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PatientAccountsService {
    constructor(private prisma: PrismaService) { }

    // Busca en la tabla patients los datos del DPI para que el auditor pueda verificar
    private async enrichWithPatientData(accounts: any[]) {
        const dpis = accounts.map(a => a.dpi);
        const patients = await this.prisma.patient.findMany({
            where: { dpi: { in: dpis } },
            select: {
                dpi: true,
                firstName: true,
                secondName: true,
                thirdName: true,
                firstLastName: true,
                secondLastName: true,
                birthDate: true,
                sex: true,
            },
        });

        const patientMap = new Map(patients.map(p => [p.dpi, p]));

        return accounts.map(account => ({
            ...account,
            patientData: patientMap.get(account.dpi) ?? null,
        }));
    }

    async findPending() {
        const accounts = await this.prisma.patientAccount.findMany({
            where: { status: 'PENDING' },
            orderBy: { createdAt: 'asc' },
        });

        return this.enrichWithPatientData(accounts);
    }

    async findAll() {
        const accounts = await this.prisma.patientAccount.findMany({
            orderBy: { createdAt: 'desc' },
        });

        return this.enrichWithPatientData(accounts);
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
