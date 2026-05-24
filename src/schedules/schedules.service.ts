// =============================================
// SchedulesService
// CRUD de horarios de trabajo (filtrado por hospital)
// =============================================

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { HospitalScopedUser, getHospitalScope } from '../common/helpers/hospital-scope.helper';

@Injectable()
export class SchedulesService {
    constructor(private prisma: PrismaService) { }

    async create(currentUser: HospitalScopedUser, dto: CreateScheduleDto) {
        const scope = getHospitalScope(currentUser);
        return this.prisma.schedule.create({ data: { ...dto, ...scope } });
    }

    async findAll(currentUser: HospitalScopedUser) {
        const scope = getHospitalScope(currentUser);
        return this.prisma.schedule.findMany({
            where: { isActive: true, ...scope },
            orderBy: [{ userId: 'asc' }, { dayOfWeek: 'asc' }],
        });
    }

    async findByUser(currentUser: HospitalScopedUser, userId: number) {
        const scope = getHospitalScope(currentUser);
        return this.prisma.schedule.findMany({
            where: { userId, isActive: true, ...scope },
            orderBy: { dayOfWeek: 'asc' },
        });
    }

    async update(id: number, dto: UpdateScheduleDto) {
        const schedule = await this.prisma.schedule.findUnique({ where: { id } });
        if (!schedule) throw new NotFoundException(`Horario con ID ${id} no encontrado`);

        return this.prisma.schedule.update({ where: { id }, data: dto });
    }

    async remove(id: number) {
        const schedule = await this.prisma.schedule.findUnique({ where: { id } });
        if (!schedule) throw new NotFoundException(`Horario con ID ${id} no encontrado`);

        return this.prisma.schedule.update({ where: { id }, data: { isActive: false } });
    }
}