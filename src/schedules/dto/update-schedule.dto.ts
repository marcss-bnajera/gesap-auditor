import { IsOptional, IsInt, IsString, IsBoolean, Min, Max, Matches } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateScheduleDto {
    @ApiPropertyOptional({ example: 2, description: '0=Domingo ... 6=Sábado' })
    @IsOptional()
    @IsInt({ message: 'El dia debe ser un numero entero' })
    @Min(0)
    @Max(6)
    dayOfWeek?: number;

    @ApiPropertyOptional({ example: '09:00' })
    @IsOptional()
    @IsString()
    @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, { message: 'Formato HH:MM requerido' })
    startTime?: string;

    @ApiPropertyOptional({ example: '18:00' })
    @IsOptional()
    @IsString()
    @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, { message: 'Formato HH:MM requerido' })
    endTime?: string;

    @ApiPropertyOptional({ example: false, description: 'true = activo, false = inactivo' })
    @IsOptional()
    @IsBoolean({ message: 'isActive debe ser true o false' })
    isActive?: boolean;
}
