import { Controller, Get, Post, Query, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { SessionsService } from './sessions.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { HospitalScopedUser } from '../common/helpers/hospital-scope.helper';

@ApiTags('Sessions')
@ApiBearerAuth('JWT')
@Controller('sessions')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SessionsController {
    constructor(private sessionsService: SessionsService) { }

    @ApiOperation({ summary: 'Sesiones activas', description: 'AUDITOR: solo de su hospital. SUPER_AUDITOR: todas.' })
    @ApiResponse({ status: 200, description: 'Lista de sesiones activas' })
    @Get('active')
    @Roles('AUDITOR', 'SUPER_AUDITOR')
    findActive(@CurrentUser() currentUser: HospitalScopedUser) {
        return this.sessionsService.findActive(currentUser);
    }

    @ApiOperation({ summary: 'Historial completo de accesos', description: 'Devuelve todas las login_sessions con filtros opcionales de fecha y estado.' })
    @ApiResponse({ status: 200, description: 'Historial de sesiones' })
    @Get('history')
    @Roles('AUDITOR', 'SUPER_AUDITOR')
    findHistory(
        @CurrentUser() currentUser: HospitalScopedUser,
        @Query('from') from?: string,
        @Query('to') to?: string,
        @Query('isActive') isActive?: string,
    ) {
        const parsedIsActive = isActive === 'true' ? true : isActive === 'false' ? false : undefined;
        return this.sessionsService.findHistory(currentUser, { from, to, isActive: parsedIsActive });
    }

    @ApiOperation({ summary: 'Historial de sesiones de un usuario' })
    @ApiParam({ name: 'userId', type: Number })
    @ApiResponse({ status: 200, description: 'Historial de sesiones del usuario' })
    @Get('user/:userId')
    @Roles('AUDITOR', 'SUPER_AUDITOR')
    findByUser(
        @CurrentUser() currentUser: HospitalScopedUser,
        @Param('userId', ParseIntPipe) userId: number,
    ) {
        return this.sessionsService.findByUser(currentUser, userId);
    }

    @ApiOperation({ summary: 'Cerrar sesión de usuario (kick)', description: 'Marca la sesión como inactiva. AUDITOR solo puede kickear usuarios de su hospital (no AUDITOR ni SUPER_AUDITOR).' })
    @ApiParam({ name: 'sessionId', type: Number })
    @ApiResponse({ status: 200, description: 'Sesión cerrada' })
    @ApiResponse({ status: 403, description: 'Sin permisos' })
    @Post('kick/:sessionId')
    @Roles('AUDITOR', 'SUPER_AUDITOR')
    kick(
        @Param('sessionId', ParseIntPipe) sessionId: number,
        @CurrentUser() currentUser: HospitalScopedUser & { id: number },
    ) {
        return this.sessionsService.kick(sessionId, currentUser);
    }
}
