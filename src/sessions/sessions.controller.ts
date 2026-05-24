import { Controller, Get, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
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

    @ApiOperation({ summary: 'Sesiones activas', description: 'AUDITOR: solo usuarios de su hospital. SUPER_AUDITOR: todas. Lista las sesiones con token activo (no expirado).' })
    @ApiResponse({ status: 200, description: 'Lista de sesiones activas' })
    @Get('active')
    @Roles('AUDITOR', 'SUPER_AUDITOR')
    findActive(@CurrentUser() currentUser: HospitalScopedUser) {
        return this.sessionsService.findActive(currentUser);
    }

    @ApiOperation({ summary: 'Historial de sesiones de un usuario', description: 'Lista todas las sesiones (activas e inactivas) de un usuario específico.' })
    @ApiParam({ name: 'userId', type: Number, description: 'ID del usuario' })
    @ApiResponse({ status: 200, description: 'Historial de sesiones del usuario' })
    @Get('user/:userId')
    @Roles('AUDITOR', 'SUPER_AUDITOR')
    findByUser(
        @CurrentUser() currentUser: HospitalScopedUser,
        @Param('userId', ParseIntPipe) userId: number,
    ) {
        return this.sessionsService.findByUser(currentUser, userId);
    }
}
