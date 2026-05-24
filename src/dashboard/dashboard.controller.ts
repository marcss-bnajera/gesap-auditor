import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { HospitalScopedUser } from '../common/helpers/hospital-scope.helper';

@ApiTags('Dashboard')
@ApiBearerAuth('JWT')
@Controller('dashboard')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DashboardController {
    constructor(private dashboardService: DashboardService) { }

    @ApiOperation({
        summary: 'Estadísticas del dashboard',
        description: 'AUDITOR: estadísticas de su hospital (emergencias activas, usuarios, pacientes sin identificar, disponibilidad de recepcionistas). SUPER_AUDITOR: estadísticas globales de todos los hospitales.',
    })
    @ApiResponse({ status: 200, description: 'Estadísticas del sistema' })
    @Get('stats')
    @Roles('AUDITOR', 'SUPER_AUDITOR')
    getStats(@CurrentUser() currentUser: HospitalScopedUser) {
        return this.dashboardService.getStats(currentUser);
    }
}
