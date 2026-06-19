// =============================================
// UsersService (Auditor)
// CRUD de usuarios + toggle active + cambiar contrasena
// AUDITOR: solo usuarios de su hospital, solo puede asignarlos a su hospital
// SUPER_AUDITOR: todos los hospitales
// ASISTENTE_PREHOSPITALARIO: usa fleetId en lugar de hospitalId
// =============================================

import {
    Injectable, NotFoundException, ConflictException,
    BadRequestException, ForbiddenException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto, ChangePasswordDto } from './dto/update-user.dto';
import { getHospitalScope, HospitalScopedUser } from '../common/helpers/hospital-scope.helper';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) { }

    async create(dto: CreateUserDto, currentUser: HospitalScopedUser) {
        const exists = await this.prisma.user.findUnique({ where: { email: dto.email } });
        if (exists) throw new ConflictException('Ya existe un usuario con ese correo');

        const role = await this.prisma.role.findUnique({ where: { id: dto.roleId } });
        if (!role || !role.isActive) {
            throw new NotFoundException(`No existe el rol con ID ${dto.roleId}`);
        }

        // AUDITOR solo puede crear usuarios en su propio hospital
        // ASISTENTE_PREHOSPITALARIO usa fleetId, hospitalId queda null
        const hospitalId = currentUser.roleName === 'SUPER_AUDITOR'
            ? (dto.hospitalId ?? null)
            : (role.name === 'ASISTENTE_PREHOSPITALARIO' ? null : currentUser.hospitalId ?? null);

        const hashedPassword = await bcrypt.hash(dto.password, 10);

        const user = await this.prisma.user.create({
            data: {
                ...dto,
                password: hashedPassword,
                hospitalId,
            },
            include: {
                role: { select: { id: true, name: true } },
                hospital: { select: { id: true, code: true, name: true } },
            },
        });

        const { password, ...result } = user;
        return result;
    }

    async findAll(currentUser: HospitalScopedUser) {
        const scope = getHospitalScope(currentUser);

        const users = await this.prisma.user.findMany({
            where: { isActive: true, ...scope },
            include: {
                role: { select: { id: true, name: true } },
                hospital: { select: { id: true, code: true, name: true } },
            },
            orderBy: [{ role: { name: 'asc' } }, { firstName: 'asc' }],
        });

        return users.map(({ password, ...u }) => u);
    }

    async findOne(id: number, currentUser: HospitalScopedUser) {
        const scope = getHospitalScope(currentUser);

        const user = await this.prisma.user.findFirst({
            where: { id, ...scope },
            include: {
                role: { select: { id: true, name: true } },
                hospital: { select: { id: true, code: true, name: true } },
            },
        });

        if (!user) throw new NotFoundException(`No se encontro el usuario con ID ${id}`);

        const { password, ...result } = user;
        return result;
    }

    async update(id: number, dto: UpdateUserDto, currentUser: HospitalScopedUser) {
        await this.findOne(id, currentUser);

        if (dto.email) {
            const emailInUse = await this.prisma.user.findFirst({
                where: { email: dto.email, NOT: { id } },
            });
            if (emailInUse) throw new ConflictException('Ese correo ya esta registrado por otro usuario');
        }

        // AUDITOR no puede mover usuarios a otro hospital
        if (currentUser.roleName !== 'SUPER_AUDITOR' && dto.hospitalId !== undefined) {
            if (dto.hospitalId !== currentUser.hospitalId) {
                throw new ForbiddenException('No puede reasignar usuarios a otro hospital');
            }
        }

        const user = await this.prisma.user.update({
            where: { id },
            data: dto,
            include: {
                role: { select: { id: true, name: true } },
                hospital: { select: { id: true, code: true, name: true } },
            },
        });

        const { password, ...result } = user;
        return result;
    }

    async toggleActive(id: number, currentUser: HospitalScopedUser & { id: number }) {
        if (currentUser.id === id) {
            throw new ForbiddenException('No puedes desactivarte a ti mismo');
        }

        const target = await this.findOne(id, currentUser) as { role: { name: string }; isActive: boolean };

        if (currentUser.roleName === 'AUDITOR') {
            const protectedRoles = ['AUDITOR', 'SUPER_AUDITOR'];
            if (protectedRoles.includes(target.role.name)) {
                throw new ForbiddenException('No tienes permisos para modificar a este usuario');
            }
        }

        const updated = await this.prisma.user.update({
            where: { id },
            data: { isActive: !target.isActive },
        });

        return {
            message: updated.isActive ? 'Usuario activado' : 'Usuario desactivado',
            isActive: updated.isActive,
        };
    }

    async changePassword(id: number, dto: ChangePasswordDto, currentUser: HospitalScopedUser) {
        await this.findOne(id, currentUser);

        const user = await this.prisma.user.findUnique({ where: { id } });
        const isValid = await bcrypt.compare(dto.currentPassword, user!.password);

        if (!isValid) throw new BadRequestException('La contrasena actual es incorrecta');

        const hashed = await bcrypt.hash(dto.newPassword, 10);
        await this.prisma.user.update({ where: { id }, data: { password: hashed } });

        return { message: 'Contrasena actualizada correctamente' };
    }

    // Obtener estado de disponibilidad de ASISTENTE_RECEPCION_CLINICA por hospital
    async getReceptionAvailability(currentUser: HospitalScopedUser) {
        const scope = getHospitalScope(currentUser);

        return this.prisma.user.findMany({
            where: {
                isActive: true,
                ...scope,
                role: { name: 'ASISTENTE_RECEPCION_CLINICA' },
            },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                availabilityStatus: true,
                hospital: { select: { id: true, code: true, name: true } },
            },
            orderBy: { firstName: 'asc' },
        });
    }
}
