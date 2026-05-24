import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { DevicesService } from './devices.service';
import { RegisterDeviceDto } from './dto/register-device.dto';
import { UpdateDeviceDto } from './dto/update-device.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { HospitalScopedUser } from '../common/helpers/hospital-scope.helper';

@ApiTags('Devices')
@ApiBearerAuth('JWT')
@Controller('devices')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DevicesController {
    constructor(private devicesService: DevicesService) { }

    @ApiOperation({ summary: 'Registrar dispositivo autorizado', description: 'Agrega un dispositivo a la whitelist del hospital. AUDITOR: solo para su hospital.' })
    @ApiResponse({ status: 201, description: 'Dispositivo registrado' })
    @Post()
    @Roles('AUDITOR', 'SUPER_AUDITOR')
    register(
        @CurrentUser() currentUser: HospitalScopedUser & { id: number },
        @Body() dto: RegisterDeviceDto,
    ) {
        return this.devicesService.register(currentUser, dto);
    }

    @ApiOperation({ summary: 'Listar dispositivos', description: 'Todos los dispositivos del hospital (activos e inactivos).' })
    @ApiResponse({ status: 200, description: 'Lista de dispositivos' })
    @Get()
    @Roles('AUDITOR', 'SUPER_AUDITOR')
    findAll(@CurrentUser() currentUser: HospitalScopedUser) {
        return this.devicesService.findAll(currentUser);
    }

    @ApiOperation({ summary: 'Dispositivos activos', description: 'Solo dispositivos con isActive=true del hospital.' })
    @ApiResponse({ status: 200, description: 'Lista de dispositivos activos' })
    @Get('active')
    @Roles('AUDITOR', 'SUPER_AUDITOR')
    findActive(@CurrentUser() currentUser: HospitalScopedUser) {
        return this.devicesService.findActive(currentUser);
    }

    @ApiOperation({ summary: 'Actualizar dispositivo' })
    @ApiParam({ name: 'id', type: Number })
    @Put(':id')
    @Roles('AUDITOR', 'SUPER_AUDITOR')
    update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateDeviceDto) {
        return this.devicesService.update(id, dto);
    }

    @ApiOperation({ summary: 'Eliminar dispositivo', description: 'Solo SUPER_AUDITOR puede eliminar dispositivos permanentemente.' })
    @ApiParam({ name: 'id', type: Number })
    @ApiResponse({ status: 200, description: 'Dispositivo eliminado' })
    @Delete(':id')
    @Roles('SUPER_AUDITOR')
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.devicesService.remove(id);
    }
}
