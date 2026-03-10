// =============================================
// DTO para crear un Horario de Trabajo
// dayOfWeek: 0=Domingo, 1=Lunes ... 6=Sabado
// startTime y endTime en formato HH:MM
// =============================================

import { IsNotEmpty, IsInt, IsString, Min, Max, Matches } from 'class-validator';

export class CreateScheduleDto {
    @IsNotEmpty({ message: 'El ID del usuario es obligatorio' })
    @IsInt({ message: 'El ID del usuario debe ser un numero entero' })
    @Min(1, { message: 'El ID del usuario debe ser mayor a 0' })
    userId: number;

    @IsNotEmpty({ message: 'El dia de la semana es obligatorio' })
    @IsInt({ message: 'El dia debe ser un numero entero' })
    @Min(0, { message: 'El dia debe ser entre 0 (Domingo) y 6 (Sabado)' })
    @Max(6, { message: 'El dia debe ser entre 0 (Domingo) y 6 (Sabado)' })
    dayOfWeek: number;

    @IsNotEmpty({ message: 'La hora de inicio es obligatoria' })
    @IsString({ message: 'La hora de inicio debe ser texto' })
    @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, { message: 'La hora de inicio debe tener formato HH:MM (24 horas)' })
    startTime: string;

    @IsNotEmpty({ message: 'La hora de fin es obligatoria' })
    @IsString({ message: 'La hora de fin debe ser texto' })
    @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, { message: 'La hora de fin debe tener formato HH:MM (24 horas)' })
    endTime: string;
}