import { Controller, Get, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { EmergenciesService } from './emergencies.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { HospitalScopedUser } from '../common/helpers/hospital-scope.helper';

@ApiTags('Emergencies')
@ApiBearerAuth('JWT')
@Controller('emergencies')
@UseGuards(JwtAuthGuard, RolesGuard)
export class EmergenciesController {
    constructor(private emergenciesService: EmergenciesService) { }

    @ApiOperation({ summary: 'Emergencias pendientes', description: 'AUDITOR: solo su hospital. SUPER_AUDITOR: todas. Monitoreo en tiempo real de emergencias PENDING.' })
    @ApiResponse({ status: 200, description: 'Lista de emergencias PENDING' })
    @Get('pending')
    @Roles('AUDITOR', 'SUPER_AUDITOR')
    findPending(@CurrentUser() currentUser: HospitalScopedUser) {
        return this.emergenciesService.findPending(currentUser);
    }

    @ApiOperation({ summary: 'Todas las emergencias', description: 'AUDITOR: solo su hospital. SUPER_AUDITOR: todas. Incluye PENDING, IN_PROGRESS y COMPLETED.' })
    @ApiResponse({ status: 200, description: 'Lista de todas las emergencias' })
    @Get()
    @Roles('AUDITOR', 'SUPER_AUDITOR')
    findAll(@CurrentUser() currentUser: HospitalScopedUser) {
        return this.emergenciesService.findAll(currentUser);
    }

    @ApiOperation({ summary: 'Detalle de una emergencia', description: 'Muestra todos los datos de la emergencia incluyendo evaluaciones XABCDE/SAMPLE.' })
    @ApiParam({ name: 'id', type: Number })
    @ApiResponse({ status: 200, description: 'Datos completos de la emergencia' })
    @Get(':id')
    @Roles('AUDITOR', 'SUPER_AUDITOR')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.emergenciesService.findOne(id);
    }
}
