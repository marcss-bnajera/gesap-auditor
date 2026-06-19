import {
    Controller, Get, Post, Put, Patch,
    Body, Param, ParseIntPipe, UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto, ChangePasswordDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { HospitalScopedUser } from '../common/helpers/hospital-scope.helper';

@ApiTags('Users')
@ApiBearerAuth('JWT')
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
    constructor(private usersService: UsersService) { }

    @ApiOperation({ summary: 'Crear usuario', description: 'AUDITOR: solo puede crear usuarios para su propio hospital. SUPER_AUDITOR: puede asignar a cualquier hospital.' })
    @ApiResponse({ status: 201, description: 'Usuario creado' })
    @Post()
    @Roles('AUDITOR', 'SUPER_AUDITOR')
    create(
        @CurrentUser() currentUser: HospitalScopedUser,
        @Body() dto: CreateUserDto,
    ) {
        return this.usersService.create(dto, currentUser);
    }

    @ApiOperation({ summary: 'Estado de disponibilidad de recepcionistas', description: 'Lista el estado AVAILABLE/BUSY/OFFLINE de los ASISTENTE_RECEPCION_CLINICA del hospital.' })
    @ApiResponse({ status: 200, description: 'Lista de recepcionistas con su estado de disponibilidad' })
    @Get('reception-availability')
    @Roles('AUDITOR', 'SUPER_AUDITOR')
    getReceptionAvailability(@CurrentUser() currentUser: HospitalScopedUser) {
        return this.usersService.getReceptionAvailability(currentUser);
    }

    @ApiOperation({ summary: 'Listar usuarios', description: 'AUDITOR: solo su hospital. SUPER_AUDITOR: todos.' })
    @ApiResponse({ status: 200, description: 'Lista de usuarios' })
    @Get()
    @Roles('AUDITOR', 'SUPER_AUDITOR')
    findAll(@CurrentUser() currentUser: HospitalScopedUser) {
        return this.usersService.findAll(currentUser);
    }

    @ApiOperation({ summary: 'Obtener usuario por ID' })
    @ApiParam({ name: 'id', type: Number })
    @ApiResponse({ status: 200, description: 'Datos del usuario' })
    @Get(':id')
    @Roles('AUDITOR', 'SUPER_AUDITOR')
    findOne(
        @Param('id', ParseIntPipe) id: number,
        @CurrentUser() currentUser: HospitalScopedUser,
    ) {
        return this.usersService.findOne(id, currentUser);
    }

    @ApiOperation({ summary: 'Actualizar usuario' })
    @ApiParam({ name: 'id', type: Number })
    @Put(':id')
    @Roles('AUDITOR', 'SUPER_AUDITOR')
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdateUserDto,
        @CurrentUser() currentUser: HospitalScopedUser,
    ) {
        return this.usersService.update(id, dto, currentUser);
    }

    @ApiOperation({ summary: 'Activar / desactivar usuario' })
    @ApiParam({ name: 'id', type: Number })
    @Patch(':id/toggle-active')
    @Roles('AUDITOR', 'SUPER_AUDITOR')
    toggleActive(
        @Param('id', ParseIntPipe) id: number,
        @CurrentUser() currentUser: HospitalScopedUser & { id: number },
    ) {
        return this.usersService.toggleActive(id, currentUser);
    }

    @ApiOperation({ summary: 'Cambiar contraseña del usuario' })
    @ApiParam({ name: 'id', type: Number })
    @Patch(':id/change-password')
    @Roles('AUDITOR', 'SUPER_AUDITOR')
    changePassword(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: ChangePasswordDto,
        @CurrentUser() currentUser: HospitalScopedUser,
    ) {
        return this.usersService.changePassword(id, dto, currentUser);
    }
}
