// =============================================
// DTO para filtrar Logs de Auditoria
// Permite buscar por usuario, accion, entidad y rango de fechas
// =============================================

import { IsOptional, IsString, IsInt, IsDateString, MaxLength, Min } from 'class-validator';

export class FilterAuditLogDto {
    @IsOptional()
    @IsInt({ message: 'El ID de usuario debe ser un numero entero' })
    @Min(1, { message: 'El ID de usuario debe ser mayor a 0' })
    userId?: number;

    @IsOptional()
    @IsString({ message: 'La accion debe ser texto' })
    @MaxLength(50, { message: 'La accion no puede exceder 50 caracteres' })
    action?: string;

    @IsOptional()
    @IsString({ message: 'La entidad debe ser texto' })
    @MaxLength(50, { message: 'La entidad no puede exceder 50 caracteres' })
    entity?: string;

    @IsOptional()
    @IsDateString({}, { message: 'La fecha de inicio debe tener formato YYYY-MM-DD' })
    startDate?: string;

    @IsOptional()
    @IsDateString({}, { message: 'La fecha de fin debe tener formato YYYY-MM-DD' })
    endDate?: string;
}