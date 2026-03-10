// =============================================
// AuthService para Auditor
// Solo valida el token JWT que viene de gesap-api
// =============================================

import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
    // Este servicio solo valida tokens via JwtStrategy
    // El login se hace en gesap-api
    async validateToken(user: any) {
        return { message: 'Token valido', user };
    }
}