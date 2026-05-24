import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuditLogsService } from './audit-logs.service';
import { FilterAuditLogDto } from './dto/filter-audit-log.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { HospitalScopedUser } from '../common/helpers/hospital-scope.helper';

@ApiTags('Audit Logs')
@ApiBearerAuth('JWT')
@Controller('audit-logs')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AuditLogsController {
    constructor(private auditLogsService: AuditLogsService) { }

    @ApiOperation({ summary: 'Listar registros de auditoría', description: 'AUDITOR: solo de su hospital. SUPER_AUDITOR: todos. Soporta filtros por userId, action, entity y rango de fechas.' })
    @ApiResponse({ status: 200, description: 'Lista de registros de auditoría' })
    @Get()
    @Roles('AUDITOR', 'SUPER_AUDITOR')
    findAll(
        @CurrentUser() currentUser: HospitalScopedUser,
        @Query() filters: FilterAuditLogDto,
    ) {
        return this.auditLogsService.findAll(currentUser, filters);
    }

    @ApiOperation({ summary: 'Resumen de auditoría agrupado', description: 'Agrupa y cuenta las acciones por tipo y entidad para una vista ejecutiva.' })
    @ApiResponse({ status: 200, description: 'Resumen agrupado de acciones auditadas' })
    @Get('summary')
    @Roles('AUDITOR', 'SUPER_AUDITOR')
    getSummary(@CurrentUser() currentUser: HospitalScopedUser) {
        return this.auditLogsService.getSummary(currentUser);
    }
}
