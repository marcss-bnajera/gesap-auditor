import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { SchedulesService } from './schedules.service';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { HospitalScopedUser } from '../common/helpers/hospital-scope.helper';

@ApiTags('Schedules')
@ApiBearerAuth('JWT')
@Controller('schedules')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SchedulesController {
    constructor(private schedulesService: SchedulesService) { }

    @ApiOperation({ summary: 'Crear horario de trabajo', description: 'Asigna un horario a un usuario del hospital. AUDITOR: solo para usuarios de su hospital.' })
    @ApiResponse({ status: 201, description: 'Horario creado' })
    @Post()
    @Roles('AUDITOR', 'SUPER_AUDITOR')
    create(@CurrentUser() currentUser: HospitalScopedUser, @Body() dto: CreateScheduleDto) {
        return this.schedulesService.create(currentUser, dto);
    }

    @ApiOperation({ summary: 'Listar horarios', description: 'Todos los horarios de usuarios del hospital.' })
    @ApiResponse({ status: 200, description: 'Lista de horarios' })
    @Get()
    @Roles('AUDITOR', 'SUPER_AUDITOR')
    findAll(@CurrentUser() currentUser: HospitalScopedUser) {
        return this.schedulesService.findAll(currentUser);
    }

    @ApiOperation({ summary: 'Horarios de un usuario específico' })
    @ApiParam({ name: 'userId', type: Number, description: 'ID del usuario' })
    @ApiResponse({ status: 200, description: 'Lista de horarios del usuario' })
    @Get('user/:userId')
    @Roles('AUDITOR', 'SUPER_AUDITOR')
    findByUser(
        @CurrentUser() currentUser: HospitalScopedUser,
        @Param('userId', ParseIntPipe) userId: number,
    ) {
        return this.schedulesService.findByUser(currentUser, userId);
    }

    @ApiOperation({ summary: 'Actualizar horario' })
    @ApiParam({ name: 'id', type: Number })
    @Put(':id')
    @Roles('AUDITOR', 'SUPER_AUDITOR')
    update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateScheduleDto) {
        return this.schedulesService.update(id, dto);
    }

    @ApiOperation({ summary: 'Eliminar horario', description: 'Solo SUPER_AUDITOR puede eliminar horarios.' })
    @ApiParam({ name: 'id', type: Number })
    @Delete(':id')
    @Roles('SUPER_AUDITOR')
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.schedulesService.remove(id);
    }
}
