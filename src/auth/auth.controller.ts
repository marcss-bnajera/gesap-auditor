import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @ApiOperation({ summary: 'Validar token JWT', description: 'Verifica que el token es válido y retorna los datos del auditor autenticado.' })
    @ApiResponse({ status: 200, description: 'Token válido — retorna datos del usuario' })
    @ApiResponse({ status: 401, description: 'Token inválido o expirado' })
    @ApiBearerAuth('JWT')
    @Get('validate')
    @UseGuards(JwtAuthGuard)
    validate(@CurrentUser() user: any) {
        return this.authService.validateToken(user);
    }
}
