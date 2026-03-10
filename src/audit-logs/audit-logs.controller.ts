// =============================================
// AuditLogsController
// GET  /gesap-auditor/v1/audit-logs          - Listar con filtros
// GET  /gesap-auditor/v1/audit-logs/summary   - Resumen
// =============================================

import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AuditLogsService } from './audit-logs.service';
import { FilterAuditLogDto } from './dto/filter-audit-log.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@Controller('audit-logs')
@UseGuards(JwtAuthGuard)
export class AuditLogsController {
    constructor(private auditLogsService: AuditLogsService) { }

    @Get()
    findAll(@Query() filters: FilterAuditLogDto) {
        return this.auditLogsService.findAll(filters);
    }

    @Get('summary')
    getSummary() {
        return this.auditLogsService.getSummary();
    }
}