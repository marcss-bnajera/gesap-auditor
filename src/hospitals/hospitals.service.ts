// =============================================
// HospitalsService
// CRUD de establecimientos de salud (solo SUPER_AUDITOR)
// =============================================

import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateHospitalDto } from './dto/create-hospital.dto';

@Injectable()
export class HospitalsService {
    constructor(private prisma: PrismaService) { }

    async create(dto: CreateHospitalDto) {
        const exists = await this.prisma.hospital.findUnique({ where: { code: dto.code } });
        if (exists) throw new ConflictException(`Ya existe un hospital con el codigo ${dto.code}`);

        return this.prisma.hospital.create({ data: dto });
    }

    async findAll() {
        return this.prisma.hospital.findMany({
            orderBy: [{ level: 'asc' }, { name: 'asc' }],
        });
    }

    async findActive() {
        return this.prisma.hospital.findMany({
            where: { isActive: true },
            orderBy: [{ level: 'asc' }, { name: 'asc' }],
        });
    }

    async findOne(id: number) {
        const hospital = await this.prisma.hospital.findUnique({ where: { id } });
        if (!hospital) throw new NotFoundException(`Hospital con ID ${id} no encontrado`);
        return hospital;
    }

    async update(id: number, dto: Partial<CreateHospitalDto>) {
        await this.findOne(id);
        return this.prisma.hospital.update({ where: { id }, data: dto });
    }

    async toggleActive(id: number) {
        const hospital = await this.findOne(id);
        return this.prisma.hospital.update({
            where: { id },
            data: { isActive: !hospital.isActive },
        });
    }
}
