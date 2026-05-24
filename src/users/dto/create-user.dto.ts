import {
    IsNotEmpty, IsEmail, IsString, IsInt, IsOptional, IsEnum,
    MinLength, MaxLength, Matches, Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum AvailabilityStatus {
    AVAILABLE = 'AVAILABLE',
    BUSY = 'BUSY',
    OFFLINE = 'OFFLINE',
}

export class CreateUserDto {
    @ApiProperty({ example: 'recepcion01@gesap.gt', description: 'Correo electrónico del nuevo usuario' })
    @IsNotEmpty({ message: 'El correo es obligatorio' })
    @IsEmail({}, { message: 'El correo debe tener formato valido' })
    @MaxLength(100)
    email: string;

    @ApiProperty({ example: 'Recep2024!', description: 'Contraseña (mín. 8 chars, mayúscula, minúscula, número, especial)' })
    @IsNotEmpty({ message: 'La contrasena es obligatoria' })
    @IsString()
    @MinLength(8, { message: 'La contrasena debe tener minimo 8 caracteres' })
    @MaxLength(50)
    @Matches(/[A-Z]/, { message: 'La contrasena debe tener al menos una mayuscula' })
    @Matches(/[a-z]/, { message: 'La contrasena debe tener al menos una minuscula' })
    @Matches(/[0-9]/, { message: 'La contrasena debe tener al menos un numero' })
    @Matches(/[!@#$%^&*]/, { message: 'La contrasena debe tener al menos un caracter especial (!@#$%^&*)' })
    password: string;

    @ApiProperty({ example: 'Ana', description: 'Nombre del usuario' })
    @IsNotEmpty({ message: 'El nombre es obligatorio' })
    @IsString()
    @MinLength(2)
    @MaxLength(50)
    @Matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/, { message: 'El nombre solo puede contener letras y espacios' })
    firstName: string;

    @ApiProperty({ example: 'Cifuentes', description: 'Apellido del usuario' })
    @IsNotEmpty({ message: 'El apellido es obligatorio' })
    @IsString()
    @MinLength(2)
    @MaxLength(50)
    @Matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/, { message: 'El apellido solo puede contener letras y espacios' })
    lastName: string;

    @ApiProperty({ example: 5, description: 'ID del rol a asignar' })
    @IsNotEmpty({ message: 'El ID del rol es obligatorio' })
    @IsInt()
    @Min(1)
    roleId: number;

    @ApiPropertyOptional({ example: 1, description: 'ID del hospital (no aplica para ASISTENTE_PREHOSPITALARIO)' })
    @IsOptional()
    @IsInt()
    @Min(1)
    hospitalId?: number;

    @ApiPropertyOptional({ example: 'FLOTA-GT-01', description: 'ID de flota (solo para ASISTENTE_PREHOSPITALARIO)' })
    @IsOptional()
    @IsString()
    @MaxLength(50)
    fleetId?: string;

    @ApiPropertyOptional({ enum: AvailabilityStatus, example: 'AVAILABLE' })
    @IsOptional()
    @IsEnum(AvailabilityStatus, { message: 'Estado de disponibilidad invalido' })
    availabilityStatus?: AvailabilityStatus;
}
