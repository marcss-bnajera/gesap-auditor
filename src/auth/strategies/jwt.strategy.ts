// =============================================
// JwtStrategy para el servicio de auditoria
// Valida el token JWT (mismo secreto que gesap-api)
// Carga el usuario completo desde la BD compartida
// =============================================

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private prisma: PrismaService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET,
        });
    }

    async validate(payload: { sub: number; email: string }) {
        const user = await this.prisma.user.findUnique({
            where: { id: payload.sub },
            include: { role: true },
        });

        if (!user || !user.isActive) {
            throw new UnauthorizedException('Usuario no encontrado o desactivado');
        }

        // Verificar que la sesion sigue activa (kick detection)
        try {
            const activeSession = await this.prisma.loginSession.findFirst({
                where: { userId: user.id, isActive: true },
            });
            if (!activeSession) {
                throw new UnauthorizedException('Tu sesión ha sido cerrada. Por favor inicia sesión nuevamente.');
            }
        } catch (err) {
            if (err instanceof UnauthorizedException) throw err;
            // Si la tabla no existe o hay error de BD, no bloquear la request
        }

        return {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            roleId: user.roleId,
            roleName: user.role.name,
            hospitalId: user.hospitalId,
            fleetId: user.fleetId,
            availabilityStatus: user.availabilityStatus,
        };
    }
}