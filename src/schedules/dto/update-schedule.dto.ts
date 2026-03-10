// =============================================
// DTO para actualizar un Horario
// =============================================

import { IsOptional, IsInt, IsString, IsBoolean, Min, Max, Matches } from 'class-validator';

export class UpdateScheduleDto {
    @IsOptional()
    @IsInt({ message: 'El dia debe ser un numero entero' })
    @Min(0)
    @Max(6)
    dayOfWeek?: number;

    @IsOptional()
    @IsString()
    @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, { message: 'Formato HH:MM requerido' })
    startTime?: string;

    @IsOptional()
    @IsString()
    @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, { message: 'Formato HH:MM requerido' })
    endTime?: string;

    @IsOptional()
    @IsBoolean({ message: 'isActive debe ser true o false' })
    isActive?: boolean;
}