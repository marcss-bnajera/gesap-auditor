import { Controller, Get, Post, Put, Patch, Body, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { HospitalsService } from './hospitals.service';
import { CreateHospitalDto } from './dto/create-hospital.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@ApiTags('Hospitals')
@ApiBearerAuth('JWT')
@Controller('hospitals')
@UseGuards(JwtAuthGuard, RolesGuard)
export class HospitalsController {
    constructor(private hospitalsService: HospitalsService) { }

    @ApiOperation({ summary: 'Crear hospital', description: 'Solo SUPER_AUDITOR puede crear hospitales.' })
    @ApiResponse({ status: 201, description: 'Hospital creado' })
    @Post()
    @Roles('SUPER_AUDITOR')
    create(@Body() dto: CreateHospitalDto) {
        return this.hospitalsService.create(dto);
    }

    @ApiOperation({ summary: 'Listar todos los hospitales', description: 'Incluye activos e inactivos.' })
    @ApiResponse({ status: 200, description: 'Lista completa de hospitales' })
    @Get()
    @Roles('AUDITOR', 'SUPER_AUDITOR')
    findAll() {
        return this.hospitalsService.findAll();
    }

    @ApiOperation({ summary: 'Listar hospitales activos' })
    @ApiResponse({ status: 200, description: 'Lista de hospitales activos' })
    @Get('active')
    @Roles('AUDITOR', 'SUPER_AUDITOR')
    findActive() {
        return this.hospitalsService.findActive();
    }

    @ApiOperation({ summary: 'Obtener hospital por ID' })
    @ApiParam({ name: 'id', type: Number })
    @ApiResponse({ status: 200, description: 'Datos del hospital' })
    @Get(':id')
    @Roles('AUDITOR', 'SUPER_AUDITOR')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.hospitalsService.findOne(id);
    }

    @ApiOperation({ summary: 'Actualizar hospital', description: 'Solo SUPER_AUDITOR.' })
    @ApiParam({ name: 'id', type: Number })
    @Put(':id')
    @Roles('SUPER_AUDITOR')
    update(@Param('id', ParseIntPipe) id: number, @Body() dto: CreateHospitalDto) {
        return this.hospitalsService.update(id, dto);
    }

    @ApiOperation({ summary: 'Activar / desactivar hospital', description: 'Solo SUPER_AUDITOR. Alterna el estado isActive.' })
    @ApiParam({ name: 'id', type: Number })
    @Patch(':id/toggle')
    @Roles('SUPER_AUDITOR')
    toggleActive(@Param('id', ParseIntPipe) id: number) {
        return this.hospitalsService.toggleActive(id);
    }
}
