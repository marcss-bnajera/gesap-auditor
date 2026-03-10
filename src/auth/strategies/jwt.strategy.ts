// =============================================
// JwtStrategy para el servicio de auditoria
// Valida el token JWT (mismo secreto que gesap-api)
// =============================================

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET,
        });
    }

    async validate(payload: { sub: number; email: string }) {
        if (!payload.sub) {
            throw new UnauthorizedException('Token invalido');
        }

        return { id: payload.sub, email: payload.email };
    }
}