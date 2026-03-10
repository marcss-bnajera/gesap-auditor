// =============================================
// SchedulesService
// CRUD de horarios de trabajo
// =============================================

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';

@Injectable()
export class SchedulesService {
    constructor(private prisma: PrismaService) { }

    async create(dto: CreateScheduleDto) {
        return this.prisma.schedule.create({ data: dto });
    }

    async findAll() {
        return this.prisma.schedule.findMany({
            where: { isActive: true },
            orderBy: [{ userId: 'asc' }, { dayOfWeek: 'asc' }],
        });
    }

    async findByUser(userId: number) {
        return this.prisma.schedule.findMany({
            where: { userId, isActive: true },
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

        return this.prisma.schedule.update({
            where: { id },
            data: { isActive: false },
        });
    }
}