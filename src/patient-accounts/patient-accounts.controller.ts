import { Controller, Get, Patch, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { PatientAccountsService } from './patient-accounts.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Patient Accounts')
@ApiBearerAuth('JWT')
@Controller('patient-accounts')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PatientAccountsController {
    constructor(private patientAccountsService: PatientAccountsService) { }

    @ApiOperation({ summary: 'Cuentas de pacientes pendientes', description: 'Lista las cuentas de pacientes que se registraron en el portal y están esperando aprobación. El auditor debe verificar el DPI antes de aprobar.' })
    @ApiResponse({ status: 200, description: 'Lista de cuentas pendientes de aprobación' })
    @Get('pending')
    @Roles('AUDITOR', 'SUPER_AUDITOR')
    findPending() {
        return this.patientAccountsService.findPending();
    }

    @ApiOperation({ summary: 'Todas las cuentas de pacientes', description: 'Incluye cuentas PENDING, APPROVED y REJECTED.' })
    @ApiResponse({ status: 200, description: 'Lista completa de cuentas' })
    @Get()
    @Roles('AUDITOR', 'SUPER_AUDITOR')
    findAll() {
        return this.patientAccountsService.findAll();
    }

    @ApiOperation({ summary: 'Aprobar cuenta de paciente', description: 'El auditor aprueba la cuenta tras verificar que el DPI coincide con los datos del paciente en el sistema.' })
    @ApiParam({ name: 'id', type: Number, description: 'ID de la cuenta de paciente' })
    @ApiResponse({ status: 200, description: 'Cuenta aprobada — paciente puede acceder al portal' })
    @Patch(':id/approve')
    @Roles('AUDITOR', 'SUPER_AUDITOR')
    approve(
        @Param('id', ParseIntPipe) id: number,
        @CurrentUser('id') userId: number,
    ) {
        return this.patientAccountsService.approve(id, userId);
    }

    @ApiOperation({ summary: 'Rechazar cuenta de paciente', description: 'El auditor rechaza la cuenta si el DPI no coincide con los datos o si hay sospecha de fraude.' })
    @ApiParam({ name: 'id', type: Number, description: 'ID de la cuenta de paciente' })
    @ApiResponse({ status: 200, description: 'Cuenta rechazada' })
    @Patch(':id/reject')
    @Roles('AUDITOR', 'SUPER_AUDITOR')
    reject(
        @Param('id', ParseIntPipe) id: number,
        @CurrentUser('id') userId: number,
    ) {
        return this.patientAccountsService.reject(id, userId);
    }
}
