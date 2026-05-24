import { IsOptional, IsString, IsInt, IsDateString, MaxLength, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class FilterAuditLogDto {
    @ApiPropertyOptional({ example: 3, description: 'Filtrar logs de un usuario específico' })
    @IsOptional()
    @IsInt({ message: 'El ID de usuario debe ser un numero entero' })
    @Min(1, { message: 'El ID de usuario debe ser mayor a 0' })
    userId?: number;

    @ApiPropertyOptional({ example: 'CREATE_EMERGENCY', description: 'Tipo de acción auditada' })
    @IsOptional()
    @IsString({ message: 'La accion debe ser texto' })
    @MaxLength(50, { message: 'La accion no puede exceder 50 caracteres' })
    action?: string;

    @ApiPropertyOptional({ example: 'Emergency', description: 'Entidad afectada por la acción' })
    @IsOptional()
    @IsString({ message: 'La entidad debe ser texto' })
    @MaxLength(50, { message: 'La entidad no puede exceder 50 caracteres' })
    entity?: string;

    @ApiPropertyOptional({ example: '2024-06-01', description: 'Fecha de inicio del rango (YYYY-MM-DD)' })
    @IsOptional()
    @IsDateString({}, { message: 'La fecha de inicio debe tener formato YYYY-MM-DD' })
    startDate?: string;

    @ApiPropertyOptional({ example: '2024-06-30', description: 'Fecha de fin del rango (YYYY-MM-DD)' })
    @IsOptional()
    @IsDateString({}, { message: 'La fecha de fin debe tener formato YYYY-MM-DD' })
    endDate?: string;
}
