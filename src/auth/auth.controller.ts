// =============================================
// AuthController para Auditor
// Endpoint para verificar que el token es valido
// =============================================

import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Get('validate')
    @UseGuards(JwtAuthGuard)
    validate(@CurrentUser() user: any) {
        return this.authService.validateToken(user);
    }
}