// =============================================
// DevicesService
// CRUD de dispositivos autorizados (whitelist)
// =============================================

import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDeviceDto } from './dto/register-device.dto';
import { UpdateDeviceDto } from './dto/update-device.dto';
import { HospitalScopedUser, getHospitalScope } from '../common/helpers/hospital-scope.helper';

@Injectable()
export class DevicesService {
    constructor(private prisma: PrismaService) { }

    async register(currentUser: HospitalScopedUser & { id: number }, dto: RegisterDeviceDto) {
        const exists = await this.prisma.authorizedDevice.findUnique({
            where: { macAddress: dto.macAddress },
        });

        if (exists) {
            throw new ConflictException('Ya existe un dispositivo con esa direccion MAC');
        }

        const scope = getHospitalScope(currentUser);
        return this.prisma.authorizedDevice.create({
            data: { ...dto, registeredBy: currentUser.id, ...scope },
        });
    }

    async findAll(currentUser: HospitalScopedUser) {
        const scope = getHospitalScope(currentUser);
        return this.prisma.authorizedDevice.findMany({
            where: scope,
            orderBy: { createdAt: 'desc' },
        });
    }

    async findActive(currentUser: HospitalScopedUser) {
        const scope = getHospitalScope(currentUser);
        return this.prisma.authorizedDevice.findMany({
            where: { isActive: true, ...scope },
            orderBy: { deviceName: 'asc' },
        });
    }

    async update(id: number, dto: UpdateDeviceDto) {
        const device = await this.prisma.authorizedDevice.findUnique({ where: { id } });
        if (!device) throw new NotFoundException(`Dispositivo con ID ${id} no encontrado`);

        return this.prisma.authorizedDevice.update({ where: { id }, data: dto });
    }

    async remove(id: number) {
        const device = await this.prisma.authorizedDevice.findUnique({ where: { id } });
        if (!device) throw new NotFoundException(`Dispositivo con ID ${id} no encontrado`);

        return this.prisma.authorizedDevice.update({
            where: { id },
            data: { isActive: false },
        });
    }

    async isAuthorized(macAddress: string): Promise<boolean> {
        const device = await this.prisma.authorizedDevice.findUnique({
            where: { macAddress },
        });
        return device?.isActive ?? false;
    }
}