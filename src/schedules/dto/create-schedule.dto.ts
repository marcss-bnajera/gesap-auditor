import { IsNotEmpty, IsInt, IsString, Min, Max, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateScheduleDto {
    @ApiProperty({ example: 5, description: 'ID del usuario al que se asigna el horario' })
    @IsNotEmpty({ message: 'El ID del usuario es obligatorio' })
    @IsInt({ message: 'El ID del usuario debe ser un numero entero' })
    @Min(1, { message: 'El ID del usuario debe ser mayor a 0' })
    userId: number;

    @ApiProperty({ example: 1, description: 'Día de la semana: 0=Domingo, 1=Lunes, 2=Martes, 3=Miércoles, 4=Jueves, 5=Viernes, 6=Sábado' })
    @IsNotEmpty({ message: 'El dia de la semana es obligatorio' })
    @IsInt({ message: 'El dia debe ser un numero entero' })
    @Min(0, { message: 'El dia debe ser entre 0 (Domingo) y 6 (Sabado)' })
    @Max(6, { message: 'El dia debe ser entre 0 (Domingo) y 6 (Sabado)' })
    dayOfWeek: number;

    @ApiProperty({ example: '08:00', description: 'Hora de inicio en formato HH:MM (24 horas)' })
    @IsNotEmpty({ message: 'La hora de inicio es obligatoria' })
    @IsString({ message: 'La hora de inicio debe ser texto' })
    @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, { message: 'La hora de inicio debe tener formato HH:MM (24 horas)' })
    startTime: string;

    @ApiProperty({ example: '17:00', description: 'Hora de fin en formato HH:MM (24 horas)' })
    @IsNotEmpty({ message: 'La hora de fin es obligatoria' })
    @IsString({ message: 'La hora de fin debe ser texto' })
    @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, { message: 'La hora de fin debe tener formato HH:MM (24 horas)' })
    endTime: string;
}
